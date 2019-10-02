import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { DangerZone } from 'expo';
import { computed, observable, action, reaction } from 'mobx';
import styleDefinitions from '../../helpers/styleDefinitions';
import log from '../../helpers/log';

const { Animated } = DangerZone;

const {
    multiply,
    sub,
    divide,
} = Animated;

@observer
export default class AntibioticLabel extends React.Component {

    @observable labelDimensions = {
        height: 0,
        width: 0,
    }

    antibioticsLabelsRowHeight = new Animated.Value(0);

    layoutMeasured = false;

    // Rotation of labels in degrees
    labelRotationDeg = -60;


    constructor(...params) {
        super(...params);
        this.setupAnimatedProps();
    }



    /**
     * Setup animated properties that depend on this.props (which are not ready when object
     * properties are initialized)
     */
    setupAnimatedProps() {

        reaction(
            () => this.props.matrix.antibioticLabelRowHeight,
            height => this.antibioticsLabelsRowHeight.setValue(height),
        );

        this.cappedLabelZoomAdjustment = divide(
            this.props.cappedLabelZoom,
            this.props.animatedZoom,
        );

        // When zooming in, we zoom from center/center – have therefore to move the labels up
        // in order to align at the bottom.
        // CAREFUL: When we zoom out, labels become bigger (as we want them to be at a minimum
        // size!)
        // Only needed on Android. On iOS, container has height 0 and overflow: visible

        this.adjustedTop = multiply(
            sub(this.cappedLabelZoomAdjustment, 1),
            this.antibioticsLabelsRowHeight,
            -0.5,
        );

        // When zooming beyond label zoom, we have to adjust a little bit for the fact that
        // every label zooms from center/center (and we need bottom/left)
        this.adjustedLeft = multiply(
            sub(this.cappedLabelZoomAdjustment, 1),
            this.antibioticsLabelsRowHeight,
            0.5,
        );
    }


    get rotationRad() {
        return this.labelRotationDeg * (Math.PI / 180);
    }

    labelTextLayoutHandler = (ev) => {
        // Android tends to re-draw labels from time to time without any obvious reason; make sure
        // we only measure labels once.
        if (this.layoutMeasured) return;
        this.layoutMeasured = true;
        const { width, height } = ev.nativeEvent.layout;
        log('AntibioticLabel: Dimensions are', width, height);
        // Android needs some more space as everything is cut outside the boxes (overflow: hidden)
        const adjustedWidth = Platform.OS === 'android' ? width + 10 : width;
        this.setDimensions(adjustedWidth, height);
    }

    /**
     * Update dimensions on the viewModel as soon as label is rendered. Needed to set top
     * transformation on matrix body/bacteria labels.
     */
    @action setDimensions(width, height) {
        this.labelDimensions.width = width;
        this.labelDimensions.height = height;
        // Switch and recalculate width/height as we use a 60 deg angle
        const effectiveHeight = Math.abs((Math.sin(this.rotationRad) * width)) +
            Math.abs((Math.cos(this.rotationRad) * height));
        log(
            'AntibioticLabel: Original width is',
            width,
            'effective height is',
            effectiveHeight,
            'effective width',
            height * 2,
        );
        this.props.antibiotic.setDimensions(
            Math.ceil(height * 2),
            Math.ceil(effectiveHeight),
        );
    }

    /**
     * Returns rotation transformation for label
     */
    @computed get labelRotatorStyle() {
        const transform = {
            transform: [{
                rotate: `${this.labelRotationDeg}deg`,
            }],
        };
        return transform;
    }

    /**
     * Let's shorten the antibiotic labels so that they don't use too much space
     * TODO: Move to the API
     */
    @computed get shortName() {
        return this.props.antibiotic.antibiotic.name
            .split('/')
            // If name has no /, limit length to 12 chars, else to 6
            .map((subName, index, total) => subName.substr(0, 12 / total.length))
            .join('/');
    }

    /**
     * Adjust antibiotic label's position so that they are nicely aligned. This is necessary
     * because transform-origin in react is center/center and cannot be changed (as it seems not
     * even with a transformation matrix)
     */
    @computed get labelRotatorAdjustmentStyle() {

        // Only align stuff when we're ready
        if (!this.props.matrix.defaultRadius) return {};

        return {
            left: this.labelDimensions.height * Math.abs(Math.sin(this.rotationRad)),
            top: this.labelDimensions.height * Math.abs(Math.cos(this.rotationRad)),
        };
    }

    /**
     * Dimensions are needed for Android, because there's no overflow: visible
     */
    @computed get labelContainerDimensions() {

        // 1st we need to get height/width of labels
        // Then we calculate antibioticLabelRowHeight on matrix (highest label)
        // Only then can we return a real height. If we return height/widht before, this will
        // be used as the dimensions for labelTextLayoutHandler
        if (!this.props.matrix.antibioticLabelRowHeight) return {};
        // Label is never wider than high (as we rotate it): Just return max height as width
        return {
            width: this.props.matrix.antibioticLabelRowHeight,
            height: this.props.matrix.antibioticLabelRowHeight,
        };
    }

    @computed get isSelected() {
        return this.props.matrix.activeResistance &&
            this.props.matrix.activeResistance.resistance.antibiotic ===
            this.props.antibiotic.antibiotic;
    }

    @computed get activeAntibioticBackground() {
        return this.isSelected ? styleDefinitions.colors.highlightBackground : 'transparent';
    }

    /**
     * If the antibotic is in the selected guideline/diagnosis:
     * - Change color of label
     * - Render priority order (from therapy the antibiotic is in)
     */
    @computed get isInSelectedGuideline() {
        return this.props.guidelineController.highlightAntibiotic(this.props.antibiotic);
    }

    render() {

        log('AntibioticLabel: Render');

        return (
            // Basic placement of label: Just set x/y
            <Animated.View
                style={ [
                    styles.labelContainer,
                    // Dimensions are needed for Android (no overflow: visible)
                    this.labelContainerDimensions,
                    {
                        opacity: this.props.animatedAntibiotic.opacity,
                        left: this.props.animatedAntibiotic.left,
                        transform: [{
                            translateY: this.adjustedTop,
                        }, {
                            translateX: this.adjustedLeft,
                        }, {
                            scale: this.cappedLabelZoomAdjustment,
                        }],
                    },
                ]}
            >
                { /* When rotating, transformation origin is center/middle; this container moves
                     transformation so that center becomes left/middle. If we do this transformation
                     on the rotation container, we'll have to adjust everything by the rotation */ }
                <View
                    style={[
                        this.labelRotatorAdjustmentStyle,
                        // Dimensions for Android (no overflow: visible)
                        this.labelContainerDimensions,
                        styles.labelRotatorAdjustments,
                    ]}>
                    { /* Rotate label */ }
                    <View
                        style={[
                            styles.labelRotator,
                            // Dimensions for Android (no overflow: visible)
                            this.labelContainerDimensions,
                            this.labelRotatorStyle,
                        ]}
                    >

                        <View style={styles.labelTextContainer}>
                            {this.isInSelectedGuideline &&
                                <View style={styles.therapyOrderView}>
                                    <Text style={styles.therapyOrderViewText}>
                                        {
                                            this.props
                                                .guidelineController
                                                .getPriorityOrderOfAntibiotic(this.props
                                                    .antibiotic.antibiotic)
                                        }
                                    </Text>
                                </View>
                            }
                            <Text
                                style={[
                                    styles.labelText,
                                    {
                                        backgroundColor: this.activeAntibioticBackground,
                                        color: (this.isInSelectedGuideline && !this.isSelected) ?
                                            styleDefinitions.colors.guidelines.darkBlue :
                                            styleDefinitions.colors.black,
                                    },
                                ]}
                                onLayout={ this.labelTextLayoutHandler }>
                                { this.shortName }
                            </Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    labelContainer: {
        position: 'absolute',
        bottom: 0,
        // borderWidth: 1,
        // borderColor: 'pink',
    },
    labelRotatorAdjustments: {
        // borderWidth: 1,
        // borderColor: 'yellow',
    },
    labelRotator: {
        // borderWidth: 1,
        // borderColor: 'tomato',
    },
    labelTextContainer: {
        flexDirection: 'row',
    },
    labelText: {
        ...styleDefinitions.base,
        ...styleDefinitions.label,
        textAlign: 'left',
        // borderWidth: 1,
        // borderColor: 'green',
    },
    therapyOrderView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 14,
        height: 14,

        backgroundColor: styleDefinitions.colors.guidelines.darkBlue,
        borderRadius: 12,

        marginRight: 3,
    },
    therapyOrderViewText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFF',
    },
});
