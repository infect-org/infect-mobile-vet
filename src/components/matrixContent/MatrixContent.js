import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction, trace } from 'mobx';
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
import AnimatedAntibiotic from '../../models/animatedAntibiotic/AnimatedAntibiotic';
import AnimatedBacterium from '../../models/animatedBacterium/AnimatedBacterium';

const { AntibioticMatrixView } = models;
const { TapGestureHandler, State } = GestureHandler;

const window = Dimensions.get('window');

log('Dimensions:', Dimensions.get('window'));
log('Screen dimensions:', Dimensions.get('screen'));

const { Animated } = DangerZone;

const {
    max,
    min,
    add,
    multiply,
    sub,
} = Animated;

@observer
export default class MatrixContent extends React.Component {

    windowWidth = window.width;
    windowHeight = window.height;
    animatedWindowWidth = new Animated.Value(window.width);
    animatedWindowHeight = new Animated.Value(window.height);

    // Base layout is a horizontally and vertically divided table:
    // - top left: logo
    // - top right: substance classes
    // - bottom left: bacteria
    // - bottom right: resistances
    // Top row includes substance class headers!
    leftColumnWidth = new Animated.Value(0);
    topRowHeight = new Animated.Value(0);
    rightColumnWidth = sub(this.animatedWindowWidth, this.leftColumnWidth);
    bottomRowHeight = sub(this.animatedWindowHeight, this.topRowHeight)

    animatedVisibleBacteriaHeight = new Animated.Value(0);
    animatedVisibleAntibioticsWidth = new Animated.Value(0);

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


    /**
     * Holds all instances of AnimatedAntibiotic, key is antibiotic (raw model), value is instance
     * of AnimatedAntibiotic
     */
    animatedAntibiotics = new Map();

    /**
     * Holds all instances of AnimatedBacterium, key is bacterium (raw model), value is instance
     * of AnimatedBacterium
     */
    animatedBacteria = new Map();



    constructor(...props) {
        super(...props);
        this.setupAnimatedValues();
        this.setupAnimatedAntibiotics();
        this.setupAnimatedBacteria();
    }


    setupAnimatedAntibiotics() {
        log('MatrixContent: Setup animatedAntibiotics');
        this.props.matrix.antibiotics.forEach((antibiotic) => {
            this.animatedAntibiotics.set(
                // Use base model (not matrixView model)
                antibiotic.antibiotic,
                new AnimatedAntibiotic(antibiotic, this.props.matrix),
            );
        });
        log('MatrixContent: animatedAntibiotics are', this.animatedAntibiotics);
    }

    setupAnimatedBacteria() {
        log('MatrixContent: Setup animatedBacteria');
        this.props.matrix.sortedBacteria.forEach((bacterium) => {
            this.animatedBacteria.set(
                // Use base model (not matrixView model)
                bacterium.bacterium,
                new AnimatedBacterium(bacterium, this.props.matrix),
            );
        });
        log('MatrixContent: animatedBacteria are', this.animatedBacteria);
    }



    /**
     * Setup animated values that depend on this.props (which are not available at the time
     * object properties are initialized)
     */
    setupAnimatedValues() {

        /**
         * Zoom for labels: Is capped so that they don't get too big or small
         */
        this.cappedLabelZoom = min(
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
        this.bacteriaLabelContainerLeft = !this.props.matrix.defaultRadius ? 0 : multiply(
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
        this.antibioticLabelContainerTop = multiply(
            sub(
                this.props.animatedZoom,
                1,
            ),
            antibioticLabelContainerHeight,
            -0.5,
        );

        this.substanceClassContainerHeight = add(
            this.bottomRowHeight,
            this.substanceClassMaxHeight,
        );

        // Update animatedVisibleBacteriaHeight whenever variables we depend on change
        reaction(
            () => this.visibleBacteriaHeight,
            (height) => {
                log('MatrixContent: Update animated visible bacteria height to', height);
                this.animatedVisibleBacteriaHeight.setValue(height);
            },
        );

        // Update animatedVisibleAntibioticsWidth whenever variables we depend on change
        reaction(
            () => this.visibleAntibioticsWidth,
            (width) => {
                log('MatrixContent: Update animated visible antibiotics width to', width);
                this.animatedVisibleAntibioticsWidth.setValue(width);
            },
        );

    }


    componentDidMount() {

        this.setupInitialLayoutHandler();

        // Store dimensions on matrixView so that radius can be calculated
        this.props.matrix.setDimensions({
            // Resistance cirlces/fonts for labels should not be too small
            width: Math.max(this.windowWidth, 1200),
            height: this.windowHeight,
        });
        log('default radius is %o', this.props.matrix.defaultRadius);

        // Whenever window dimensions change (rotation landscape/portrait), update animated
        // window dimensions
        Dimensions.addEventListener('change', (ev) => {
            log('MatrixContent: Window dimensions changed to', ev.window);
            this.windowWidth = ev.window.width;
            this.windowHeight = ev.window.height;
            this.animatedWindowWidth.setValue(this.windowWidth);
            this.animatedWindowHeight.setValue(this.windowHeight);
        });

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
                this.sendLayoutToProps();

                this.leftColumnWidth.setValue(this.bacteriumLabelColumnWidth);
                this.topRowHeight.setValue(this.antibioticLabelRowHeight +
                    this.substanceClassMaxHeight);

            },
        );

    }


    /**
     * Updates container and content layout on parent container (PanHandler)
     */
    sendLayoutToProps() {
        log('MatrixContent: Update content and container layout on parent');
        this.props.handleContainerLayout({
            // Its crucial that these values correspond to the ones defined for
            // resistanceContainer (render method below)
            width: Math.round(this.windowWidth - this.bacteriumLabelColumnWidth -
                this.layoutElementPadding),
            height: Math.round(this.windowHeight - this.antibioticLabelRowHeight -
                this.layoutElementPadding),
        });
        this.props.handleContentLayout({
            width: Math.round(this.visibleAntibioticsWidth),
            height: Math.round(this.visibleBacteriaHeight),
        });

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
        // Wait until radius is known (layout has been measured)
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
        trace();



        return (
            <View style={ styles.container }>

                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            width: this.leftColumnWidth,
                            height: this.topRowHeight,
                        },
                    ]}
                >
                    <View style={styles.logoCenterer}>
                        <InfectLogo
                            width={36}
                            fillColor={styleDefinitions.colors.darkGreen}
                            height={36 * 30.64 / 20.23} />
                    </View>
                </Animated.View>


                { /* SUBSTANCE CLASSES (headers and lines) */ }
                { this.props.matrix.defaultRadius &&

                    <Animated.View
                        style={[styles.substanceClassesContainer, {
                            left: this.leftColumnWidth,
                            top: this.antibioticLabelRowHeight,
                            width: this.rightColumnWidth,
                            height: this.substanceClassContainerHeight,
                        }]}
                    >
                        <Animated.View
                            style={[
                                {
                                    width: this.animatedVisibleAntibioticsWidth,
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
                                matrix={this.props.matrix}
                                height={this.substanceClassHeight}
                            />
                        </Animated.View>
                        { /* Vertical lines (substance class dividers; below resistances)
                         Only display after we know where to put them */ }
                        <Animated.View
                            style={[
                                {
                                    width: this.animatedVisibleAntibioticsWidth,
                                    height: this.animatedVisibleBacteriaHeight,
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
                    </Animated.View>
                }



                { /* RESISTANCES */ }
                { /* Container within which resistances will be moved/zoomed. Needed to
                     set the stage (container) and calculate its size for PanPinch */ }
                { this.props.matrix.defaultRadius &&

                    /* Resistance view (scrollable area) */
                    <Animated.View
                        style={[styles.resistancesContainer, {
                            left: this.leftColumnWidth,
                            top: this.antibioticLabelRowHeight + this.substanceClassMaxHeight,
                            width: this.rightColumnWidth,
                            height: this.bottomRowHeight,
                        }]}
                        onLayout={ev =>
                            this.props.handleContainerLayout(ev.nativeEvent.layout)
                        }
                    >

                        { /* Resistances (scrolling view) */ }
                        { /* Must be above labels (for a lower z-index) */ }
                        <Animated.View
                            style={[
                                styles.resistanceCirclesContainer,
                                {
                                    width: this.animatedVisibleAntibioticsWidth,
                                    height: this.animatedVisibleBacteriaHeight,
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
                                        animatedAntibiotic={this.animatedAntibiotics.get(res.resistance.antibiotic)}
                                        animatedBacterium={this.animatedBacteria.get(res.resistance.bacterium)}
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
                            width={this.animatedVisibleAntibioticsWidth}
                            height={this.animatedVisibleBacteriaHeight}
                            resistanceTransformation={this.getResistanceTransformation()}
                        />


                    </Animated.View>

                }



                { /* ANTIBIOTICS */ }
                <Animated.View
                    style={[
                        styles.antibioticLabelsContainer,
                        {
                            height: this.antibioticLabelRowHeight,
                            left: this.bacteriumLabelColumnWidth,
                            width: this.animatedVisibleAntibioticsWidth,
                        },
                        this.labelOpacity,
                    ]}
                >


                    <Animated.View
                        style={[
                            styles.antibioticContainer,
                            {
                                width: this.animatedVisibleAntibioticsWidth,
                                height: this.antibioticLabelContainerHeight,
                            },
                            {
                                transform: [{
                                    translateX: this.props.animatedLeft,
                                }, {
                                    translateY: this.antibioticLabelContainerTop,
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
                                animatedAntibiotic={this.animatedAntibiotics.get(ab.antibiotic)}
                                animatedZoom={this.props.animatedZoom}
                                cappedLabelZoom={this.cappedLabelZoom}
                                maxZoom={this.labelZoomCaps.max}
                                key={ab.antibiotic.id}
                                matrix={this.props.matrix} />
                        ))}

                    </Animated.View>

                </Animated.View>



                { /* BACTERIA */ }
                <Animated.View
                    style={[
                        styles.bacteriumLabelsContainer,
                        {
                            width: this.leftColumnWidth,
                            top: this.topRowHeight,
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
                            height: this.bottomRowHeight,
                            paddingTop: this.layoutElementPadding,
                        },
                        this.labelOpacity,
                    ]}>


                    <Animated.View
                        style={[
                            styles.bacteriumLabels,
                            {
                                width: this.bacteriaLabelContainerWidth,
                                right: this.layoutElementPadding,
                                height: this.animatedVisibleBacteriaHeight,
                                // + this.props.matrix.defaultRadius, (may be needed for android)
                                // Beware: THE FUCKING ORDER MATTERS!
                                transform: [{
                                    translateX: this.bacteriaLabelContainerLeft,
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
                                animatedBacterium={this.animatedBacteria.get(bact.bacterium)}
                                cappedLabelZoom={this.cappedLabelZoom}
                                animatedZoom={this.props.animatedZoom}
                                maxZoom={this.labelZoomCaps.max}
                                bacterium={bact}
                                matrix={this.props.matrix} />
                        )) }

                    </Animated.View>

                </Animated.View>

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
        // backgroundColor: 'coral',
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
        // borderColor: 'navy',
    },
    resistanceCirclesContainer: {
        position: 'absolute',
        // borderWidth: 1,
        // borderColor: 'pink',
    },
});
