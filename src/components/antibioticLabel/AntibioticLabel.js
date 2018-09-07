import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { observer } from 'mobx-react';
import Animated from 'react-native-reanimated';
import { computed, observable, action, reaction } from 'mobx';
import styleDefinitions from '../../helpers/styleDefinitions';
import log from '../../helpers/log';

const {
    Value,
    multiply,
    sub,
    divide,
} = Animated;

@observer
export default class AntibioticLabel extends React.Component {

    left = 0;

    @observable labelDimensions = {
        height: 0,
        width: 0,
    }

    layoutMeasured = false;

    // Rotation of labels in degrees
    labelRotationDeg = -60;

    constructor(...params) {
        super(...params);
        reaction(
            // TODO: When setValue is available, use setValue and remove forceUpdate
            () => this.props.matrix.defaultRadius && this.props.containerWidth,
            () => {
                this.setupAnimatedProps();
                this.forceUpdate();
            },
        );
    }

    /**
     * We must update our Animated stuff whenever new data is available or the old values won't be
     * available any more. TODO: Use setValue when it becomes available
     */
    setupAnimatedProps() {
        const position = this.props.matrix.xPositions.get(this.props.antibiotic);
        // Why 1.7? It just works.
        const left = Platform.OS === 'android' ?
            position.left - this.labelDimensions.height / 1.7 :
            position.left;
        this.baseLeft = new Value(left);
        this.left = sub(
            multiply(
                this.baseLeft,
                this.props.additionalLabelSpacingIncrease,
            ),
            multiply(
                // See BacteriumLabel for docs – works the same way
                divide(this.props.containerWidth, 2),
                sub(this.props.additionalLabelSpacingIncrease, 1),
            ),
        );
    }


    get rotationRad() {
        return this.labelRotationDeg * (Math.PI / 180);
    }

    /**
     * Returns the basic x/y transformation that is applied to the label
     */
    @computed get top() {
        // We only know the transformation after defaultRadius is available; before just don't
        // position anything
        if (!this.props.matrix.defaultRadius) return 0;
        // Label must be at the top for android; at the bottom for iOS
        let top;
        if (Platform.OS === 'android') top = 0;
        else {
            top = this.props.matrix.antibioticLabelRowHeight * this.props.maxZoom;
        }
        return top;
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
        log('ABLabel: Effective height is', effectiveHeight, 'width', height * 2);
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

        if (Platform.OS === 'android') {
            return {
                left: this.labelDimensions.height * Math.abs(Math.sin(this.rotationRad)),
                top: this.labelDimensions.height * Math.abs(Math.cos(this.rotationRad)),
            };
        }

        // iOS: Move rotation center from center/center to left/middle
        const moveDown = ((this.labelDimensions.width / 2) * Math.sin(this.rotationRad)) -
            ((this.labelDimensions.height / 2) * Math.cos(this.rotationRad));
        const moveLeft = ((this.labelDimensions.width / 2) * Math.cos(this.rotationRad) * -1) -
            ((this.labelDimensions.height / 2) * Math.sin(this.rotationRad));
        // Transformation origin is center/center; adjust position to create a translation
        // originating at left/middle.
        log('AntibioticLabel: Adjustments are', moveDown, moveLeft);
        return {
            transform: [{
                translateX: Math.round(moveLeft - (this.props.matrix.defaultRadius || 0)),
            }, {
                translateY: Math.round(moveDown),
            }],
        };
    }

    /**
     * Dimensions are needed for Android, because there's no overflow: visible
     */
    @computed get labelContainerDimensions() {
        if (Platform.OS === 'ios') return {};
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

    render() {

        if (this.props.matrix.defaultRadius) this.setupAnimatedProps();

        return (
            // Basic placement of label: Just set x/y
            <Animated.View
                style={ [
                    styles.labelContainer,
                    // Dimensions for Android (no overflow: visible)
                    this.labelContainerDimensions,
                    {
                        transform: [{
                            translateY: this.top,
                        }, {
                            translateX: this.left,
                        }],
                    },
                ] }>
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
                        style={ [
                            styles.labelRotator,
                            // Dimensions for Android (no overflow: visible)
                            this.labelContainerDimensions,
                            this.labelRotatorStyle,
                        ] }
                    >
                        <Text
                            style={ [
                                styles.labelText,
                            ] }
                            onLayout={ this.labelTextLayoutHandler }>
                            { this.shortName }
                        </Text>
                    </View>
                </View>
            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    labelContainer: {
        position: 'absolute',
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
    labelText: {
        ...styleDefinitions.base,
        ...styleDefinitions.label,
        textAlign: 'left',
        // borderWidth: 1,
        // borderColor: 'green',
    },
});
