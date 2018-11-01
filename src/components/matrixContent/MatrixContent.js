import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import { DangerZone, GestureHandler } from 'expo';
import { models } from 'infect-frontend-logic';
import Resistance from '../resistance/Resistance';
import ActiveResistanceDetail from '../resistance/ActiveResistanceDetail';
import SubstanceClassDivider from '../substanceClassDivider/SubstanceClassDivider';
import SubstanceClassHeaders from '../substanceClassHeaders/SubstanceClassHeaders';
import log from '../../helpers/log';
import BacteriumLabel from '../bacteriumLabel/BacteriumLabel';
import AntibioticLabel from '../antibioticLabel/AntibioticLabel';
import componentStates from '../../models/componentStates/componentStates';
import InfectLogo from '../infectLogo/InfectLogo';
import styleDefinitions from '../../helpers/styleDefinitions';

const { AntibioticMatrixView } = models;
const { TapGestureHandler, State } = GestureHandler;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
log('Dimensions:', Dimensions.get('window'));
log('Screen dimensions:', Dimensions.get('screen'));

const { Animated } = DangerZone;

const {
    max,
    min,
    multiply,
    sub,
} = Animated;

@observer
export default class MatrixContent extends React.Component {

    width = Math.max(windowWidth, 1200);

    state = {
        // Needed to re-render on android so that onLayout is fired
        renderCount: 0,
    }

    /**
     * Height of the colored lines that represent substance classes
     */
    substanceClassHeight = 8;

    /**
     * Padding between substance class lines and matrix
     */
    layoutElementPadding = 4;

    contentElement = React.createRef();

    /**
     * Number of resistances that were successfully rendered. Hide loading screen after all of them
     * were rendered
     */
    renderedResistances = 0;

    /**
     * Cap zoom for labels so that they don't get too big (and take up too much space) or become
     * unreadably small
     */
    labelZoomCaps = {
        max: 1.2,
        min: 0.7,
    }


    componentDidMount() {

        this.setupInitialLayoutHandler();

        // Store dimensions on matrixView so that radius can be calculated
        this.props.matrix.setDimensions({
            // Resistance cirlces/fonts for labels should not be too small
            width: this.width,
            height: windowHeight,
        });
        log('default radius is %o', this.props.matrix.defaultRadius);

    }


    /**
     * Android doesn't fire onLayout on *first* render – only on subsequent renders. Somehow, we
     * have to set the container and content's dimensions for PanPinch. Do this whenever layout
     * is measured.
     */
    setupInitialLayoutHandler() {

        // TODO: Should we only continue on Android devices? Or does it speed up the initial layout
        // on iOS as well?

        log('MatrixContent: Setup initial layout handler');

        // We only need to update layout on the *first* render – subsequent layout changes are
        // handled correctly by Android.
        let layoutHandlerFired = false;
        reaction(
            // Fire when label col's width or label row's height changes for the first time
            () => this.bacteriumLabelColumnWidth || this.antibioticLabelRowHeight,
            () => {

                log(
                    'MatrixContent: Try to set initial layout, width is',
                    this.bacteriumLabelColumnWidth,
                    this.antibioticLabelRowHeight,
                );

                if (layoutHandlerFired) return;
                // Only act when width/height is known
                if (!this.bacteriumLabelColumnWidth || !this.antibioticLabelRowHeight) return;
                layoutHandlerFired = true;

                log('MatrixContent: Set initial layout');
                this.props.handleContainerLayout({
                    // Its crucial that these values correspond to the ones defined for
                    // resistanceContainer (render method below)
                    width: Math.round(windowWidth - this.bacteriumLabelColumnWidth -
                        this.layoutElementPadding),
                    height: Math.round(windowHeight - this.antibioticLabelRowHeight -
                        this.layoutElementPadding),
                });
                this.props.handleContentLayout({
                    width: Math.round(this.visibleAntibioticsWidth),
                    height: Math.round(this.visibleBacteriaHeight),
                });

            },
        );

    }


    /* @computed get halfSpace() {
        return this.props.matrix.spaceBetweenGroups / 2;
    } */

    @computed get labelOpacity() {
        const opacity = this.props.matrix.defaultRadius ? 1 : 0;
        return { opacity };
    }

    /**
     * Android has no overflow: visible. Height of bacteria label container must correspond to the
     * height of all labels or labels won't be visible.
     */
    @computed get visibleBacteriaHeight() {
        if (!this.props.matrix.defaultRadius) return 0;
        // Add 1 to number of bacteria to be sure everything's visible
        const height = (this.props.matrix.defaultRadius * 2 + this.props.matrix.space) *
            (this.props.matrix.sortedVisibleBacteria.length + 1);
        log('Matrix: Height of visible bacteria is', height);
        return height;
    }

    /**
     * Height of all visible bacteria; needed for Android that has no overflow: visible
     */
    @computed get visibleAntibioticsWidth() {
        if (!this.props.matrix.defaultRadius) return 0;
        const visibleAntibiotics = this.props.matrix.sortedAntibiotics.filter(antibiotic =>
            antibiotic.visible);
        const width =
            (
                this.props.matrix.defaultRadius * 2 +
                this.props.matrix.space
            ) * visibleAntibiotics.length +
            // Every substance class gets a line of width 1 and 2x space (TODO: only count the
            // classes that DO have a divider)
            this.props.matrix.substanceClasses.length * this.props.matrix.space * 2;
        log('Matrix: Width of visible antibiotics is', width);
        return width;
    }

    /**
     * Callback that is invoked from every resistance that has finished rendering.
     */
    resistanceRendered = () => {
        this.renderedResistances += 1;
        if (this.renderedResistances === this.props.matrix.resistances.length) {
            log('Matrix: Rendering is done');
            this.props.componentStates.update('resistances', componentStates.ready);
        }
    }

    /**
     * Helper function that returns the key of a resistance (needed to iterate).
     */
    getResistanceKey(resistance) {
        return `${resistance.resistance.antibiotic.id}/${resistance.resistance.bacterium.id}`;
    }

    /**
     * Returns the max height substanceClass rectangles can get (when fully zoomed).
     */
    @computed get substanceClassMaxHeight() {
        return this.substanceClassHeight * this.props.zoomRange[1];
    }

    @computed get antibioticLabelRowHeight() {
        // «Zoom into» bar with bact labels by max label zoom factor so that we don't have to
        // transform when zooming in
        // Add half a space to give it a small border so that resistances disappear behind labels
        // before they touch them (when panning)
        return this.props.matrix.defaultRadius ?
            this.labelZoomCaps.max * this.props.matrix.antibioticLabelRowHeight +
            this.layoutElementPadding : 0; // TODO: Maybe auto is needed on Android?
    }

    /**
     * Creates an object that can be consumed by a react native's transform style property
     */
    getResistanceTransformation() {
        const transform = [
            { translateX: this.props.animatedLeft },
            { translateY: this.props.animatedTop },
            { scale: this.props.animatedZoom },
        ];
        return { transform };
    }


    /**
     * Returns the width of the whole bacteria label column
     */
    @computed get bacteriumLabelColumnWidth() {
        // «Zoom into» bar with bact labels by max label zoom factor so that we don't have to
        // transform when zooming in
        // Add half a space to give it a small border so that resistances disappear behind labels
        // before they touch them (when panning)
        return this.props.matrix.defaultRadius ?
            this.labelZoomCaps.max * this.props.matrix.bacteriumLabelColumnWidth +
            this.layoutElementPadding : 0;
    }

    handleResistanceTapStateChange(ev) {
        log('MatrixContent: Tap; handle state change for event', ev.nativeEvent);
        const start = new Date().getTime();
        if (ev.nativeEvent.state === State.ACTIVE) {
            const closestBacterium = this.getClosestBacterium(ev.nativeEvent.y);
            const closestAntibiotic = this.getClosestAntibiotic(ev.nativeEvent.x);
            if (!closestBacterium || !closestAntibiotic) {
                log('MatrixContent: Could not find closest bacterium or antibiotic');
                return;
            }
            log('MatrixContent: Tapped', closestBacterium, closestAntibiotic, ev.nativeEvent);
            const closestResistance = this.props.matrix.resistances.find(resistance => (
                resistance.resistance.bacterium === closestBacterium.bacterium &&
                resistance.resistance.antibiotic === closestAntibiotic.antibiotic
            ));
            log('MatrixView: Closest resistance', closestResistance);
            log('MatrixContent: Got closest resistance in', new Date().getTime() - start, 'ms');
            if (!closestResistance) return;

            if (closestResistance === this.props.matrix.activeResistance) {
                // If user taps on already selected resistance, hide it
                this.props.matrix.setActiveResistance();
            } else {
                this.props.matrix.setActiveResistance(closestResistance);
            }

        }
    }

    getClosestBacterium(yPosition) {
        const closest = {
            difference: Infinity,
            bacterium: undefined,
        };
        this.props.matrix.yPositions.forEach((position, bacterium) => {
            const bacteriumCenter = position.top + this.props.matrix.defaultRadius;
            const diff = Math.abs(bacteriumCenter - yPosition);
            if (diff < closest.difference) {
                closest.difference = diff;
                closest.bacterium = bacterium;
            }
        });
        return closest.bacterium;
    }

    getClosestAntibiotic(xPosition) {
        const closest = {
            difference: Infinity,
            antibiotic: undefined,
        };
        this.props.matrix.xPositions.forEach((position, item) => {
            // item may be an AntibioticMatrixView or a SubstanceClassMatrixView. Ignore substance
            // classes as they are not helpful to get the right resistance.
            if (!(item instanceof AntibioticMatrixView)) return;
            const center = (position.left + position.right) / 2;
            const diff = Math.abs(center - xPosition);
            if (diff < closest.difference) {
                closest.difference = diff;
                closest.antibiotic = item;
            }
        });
        return closest.antibiotic;
    }


    render() {

        log('MatrixContent: Render');

        /**
         * Zoom for labels: Is capped so that they don't get too big or small
         */
        const cappedLabelZoom = min(
            this.labelZoomCaps.max,
            max(
                this.labelZoomCaps.min,
                this.props.animatedZoom,
            ),
        );


        /**
         * Container should always look like right:0 – as zoom origin is center/center, we have
         * to move it
         */
        const bacteriaLabelContainerWidth = this.bacteriumLabelColumnWidth * 2;
        const bacteriaLabelContainerLeft = !this.props.matrix.defaultRadius ? 0 : multiply(
            sub(
                this.props.animatedZoom,
                1,
            ),
            // This corresponds to the container's width
            bacteriaLabelContainerWidth,
            -0.5,
        );


        const antibioticLabelContainerHeight = this.props.matrix.defaultRadius ?
            this.antibioticLabelRowHeight * 2 : 0;
        const antibioticLabelContainerTop = multiply(
            sub(
                this.props.animatedZoom,
                1,
            ),
            antibioticLabelContainerHeight,
            -0.5,
        );


        return (
            <View style={ styles.container }>

                <View
                    style={[
                        styles.logoContainer,
                        {
                            width: this.bacteriumLabelColumnWidth,
                            height: this.antibioticLabelRowHeight + this.substanceClassMaxHeight,
                        },
                    ]}
                >
                    <View style={styles.logoCenterer}>
                        <InfectLogo
                            width={36}
                            fillColor={styleDefinitions.colors.darkGreen}
                            height={36 * 30.64 / 20.23} />
                    </View>
                </View>


                { /* SUBSTANCE CLASSES */ }
                { this.props.matrix.defaultRadius &&

                    <View
                        style={[styles.substanceClassesContainer, {
                            left: this.bacteriumLabelColumnWidth,
                            top: this.antibioticLabelRowHeight,
                            width: windowWidth - this.bacteriumLabelColumnWidth,
                            height: windowHeight - this.antibioticLabelRowHeight,
                        }]}
                    >
                        <Animated.View
                            style={[
                                {
                                    width: this.visibleAntibioticsWidth,
                                    height: this.substanceClassMaxHeight,
                                    position: 'absolute',
                                },
                                // Similar to antibiotics: They are fixed to the top
                                {
                                    transform: [{
                                        translateX: this.props.animatedLeft,
                                    }, {
                                        scale: this.props.animatedZoom,
                                    }],
                                },
                            ]}
                        >
                            <SubstanceClassHeaders
                                substanceClasses={this.props.matrix.substanceClasses}
                                height={this.substanceClassHeight}
                            />
                        </Animated.View>
                        { /* Vertical lines (substance class dividers; below resistances)
                         Only display after we know where to put them */ }
                        <Animated.View
                            style={[
                                {
                                    width: this.visibleAntibioticsWidth,
                                    height: this.visibleBacteriaHeight,
                                    position: 'absolute',
                                    top: this.substanceClassHeight,
                                },
                                this.getResistanceTransformation(),
                            ]}
                        >
                            { this.props.matrix.substanceClasses.map(sc => (
                                <SubstanceClassDivider
                                    key={sc.substanceClass.id}
                                    matrix={this.props.matrix}
                                    substanceClass={sc}
                                />
                            )) }
                        </Animated.View>
                    </View>
                }



                { /* RESISTANCES */ }
                { /* Container within which resistances will be moved/zoomed. Needed to
                     set the stage (container) and calculate its size for PanPinch */ }
                { this.props.matrix.defaultRadius &&

                    <View
                        style={[styles.resistancesContainer, {
                            left: this.bacteriumLabelColumnWidth,
                            top: this.antibioticLabelRowHeight + this.substanceClassMaxHeight,
                            width: windowWidth - this.bacteriumLabelColumnWidth,
                            height: windowHeight - this.antibioticLabelRowHeight -
                                this.substanceClassMaxHeight,
                        }]}
                        onLayout={ev =>
                            this.props.handleContainerLayout(ev.nativeEvent.layout)
                        }
                    >

                        { /* Resistances: Below labels (z-index) */ }
                        <Animated.View
                            style={[
                                styles.resistanceCirclesContainer,
                                {
                                    width: this.visibleAntibioticsWidth,
                                    height: this.visibleBacteriaHeight,
                                },
                                this.getResistanceTransformation(),
                            ]}
                            onLayout={ev =>
                                this.props.handleContentLayout(ev.nativeEvent.layout)}
                        >

                            <View
                                style={styles.container}
                                pointerEvents="none"
                            >
                                { this.props.matrix.resistances.map(res => (
                                    <Resistance
                                        key={this.getResistanceKey(res)}
                                        matrix={this.props.matrix}
                                        resistance={res}
                                        onRender={this.resistanceRendered}
                                    />
                                ))}
                            </View>

                            { /* It *might* speed things up if TapGetureHandler does not contain
                                 all 1000 resistances, therefore we fill it with an empty View */ }
                            <TapGestureHandler
                                style={styles.container}
                                onHandlerStateChange={
                                    this.handleResistanceTapStateChange.bind(this)
                                }
                            >
                                <View style={styles.tapHandlerContent} />
                            </TapGestureHandler>

                        </Animated.View>


                        { /* Active Resistance:
                             Highest z-index of all resistances, therefore at the bottom. Use a
                             separate component to prevent re-render of MatrixContent when it
                             becomes available */ }
                        <ActiveResistanceDetail
                            matrix={this.props.matrix}
                            width={this.visibleAntibioticsWidth}
                            height={this.visibleBacteriaHeight}
                            resistanceTransformation={this.getResistanceTransformation()}
                        />


                    </View>

                }



                { /* ANTIBIOTICS */ }
                <View
                    style={[
                        styles.antibioticLabelsContainer,
                        {
                            height: this.antibioticLabelRowHeight,
                            left: this.bacteriumLabelColumnWidth,
                            width: this.visibleAntibioticsWidth,
                        },
                        this.labelOpacity,
                    ]}
                >


                    <Animated.View
                        style={[
                            styles.antibioticContainer,
                            {
                                width: this.visibleAntibioticsWidth,
                                height: antibioticLabelContainerHeight,
                            },
                            {
                                transform: [{
                                    translateX: this.props.animatedLeft,
                                }, {
                                    translateY: antibioticLabelContainerTop,
                                }, {
                                    scale: this.props.animatedZoom,
                                }],
                            },
                        ]}
                    >

                        { this.props.matrix.sortedAntibiotics.map(ab => (
                            <AntibioticLabel
                                // We increase the container's height by 2 (to prevent cut text
                                // on android), therefore we have to move the label down by half
                                // the container's height
                                moveLabelDownBy={this.props.matrix.defaultRadius ?
                                    this.antibioticLabelRowHeight : 0}
                                antibiotic={ab}
                                animatedZoom={this.props.animatedZoom}
                                cappedLabelZoom={cappedLabelZoom}
                                maxZoom={this.labelZoomCaps.max}
                                key={ab.antibiotic.id}
                                matrix={this.props.matrix} />
                        ))}

                    </Animated.View>

                </View>



                { /* BACTERIA */ }
                <View
                    style={[
                        styles.bacteriumLabelsContainer,
                        {
                            width: this.bacteriumLabelColumnWidth,
                            top: this.antibioticLabelRowHeight + this.substanceClassMaxHeight,
                            // Height: We need some additional height for Android or bottom-most
                            // label is cut off when zooming out (as we increase the font size)
                            // height: !this.props.matrix.defaultRadius ? 0 :
                            // If only 2 bacteria are displayed, we can still pan them
                            // across the whole screen. Therefore, bacteria labels must
                            // also be visible on the whole screen
                            // NOPE: Fucks up when we zoom in
                            // Math.max(
                            // this.visibleBacteriaHeight + this.props.matrix.defaultRadius,
                            // windowHeight,
                            // ),
                            height: windowHeight - this.antibioticLabelRowHeight -
                                this.substanceClassMaxHeight,
                            paddingTop: this.layoutElementPadding,
                        },
                        this.labelOpacity,
                    ]}>


                    <Animated.View
                        style={[
                            styles.bacteriumLabels,
                            {
                                width: bacteriaLabelContainerWidth,
                                right: this.layoutElementPadding,
                                height: this.visibleBacteriaHeight,
                                // + this.props.matrix.defaultRadius, (may be needed for android)
                                // Beware: THE FUCKING ORDER MATTERS!
                                transform: [{
                                    translateX: bacteriaLabelContainerLeft,
                                }, {
                                    translateY: this.props.animatedTop,
                                }, {
                                    scale: this.props.animatedZoom,
                                }],
                            },
                        ]}
                    >

                        { this.props.matrix.sortedBacteria.map(bact => (
                            <BacteriumLabel
                                key={bact.bacterium.id}
                                containerHeight={this.props.containerHeight}
                                cappedLabelZoom={cappedLabelZoom}
                                animatedZoom={this.props.animatedZoom}
                                maxZoom={this.labelZoomCaps.max}
                                bacterium={bact}
                                matrix={this.props.matrix} />
                        )) }

                    </Animated.View>

                </View>

            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'grey',
    },
    logoContainer: {
        position: 'absolute',
        padding: 20,
        left: 0,
        top: 0,
    },
    logoCenterer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    antibioticLabelsContainer: {
        position: 'absolute',
        top: 0,
        // borderWidth: 1,
        // borderColor: 'deeppink',
        overflow: 'hidden',
    },
    antibioticContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        // borderColor: 'salmon',
        // borderWidth: 1,
    },
    bacteriumLabelsContainer: {
        position: 'absolute',
        left: 0,
        overflow: 'hidden',
        // borderColor: 'tomato',
        // borderWidth: 1,
        // backgroundColor: 'coral',
    },
    bacteriumLabels: {
        height: '100%',
        position: 'absolute',
        // borderColor: 'salmon',
        // borderWidth: 1,
    },
    tapHandlerContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: 'rgba(200, 10, 120, 0.3)',
    },
    resistancesContainer: {
        position: 'absolute',
        overflow: 'hidden', // Force same behavior on iOS and Android
        // borderWidth: 1,
        // borderColor: 'salmon',
    },
    substanceClassesContainer: {
        position: 'absolute',
        overflow: 'hidden',
        borderWidth: 1,
        // This is really, really fucking stupid: If we don't have a border, Android (that does
        // basically not know overflow:visible) will do an overflow:visible.
        borderColor: 'transparent',
    },
    resistanceCirclesContainer: {
        position: 'absolute',
        // borderWidth: 1,
        // borderColor: 'pink',
    },
});
