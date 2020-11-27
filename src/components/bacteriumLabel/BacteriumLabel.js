import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import { DangerZone } from 'expo';
import styleDefinitions from '../../helpers/styleDefinitions';
import log from '../../helpers/log';

import isBacteriumInSelectedGuideline from '../guideline/helpers/isBacteriumInSelectedGuideline.js';

const { Animated } = DangerZone;

const {
    multiply,
    sub,
    divide,
} = Animated;

@observer
export default class BacteriumLabel extends React.Component {

    width = new Animated.Value(0);
    widthSet = false;

    constructor(...props) {
        super(...props);
        this.setupAnimatedProps();
    }

    /**
     * Setup calculated animated values; this can only be done after properties are available.
     */
    setupAnimatedProps() {

        this.top = multiply(
            // Adjust top by the amount animatedZoom exceeds cappedLabelZoom
            divide(this.props.animatedZoom, this.props.cappedLabelZoom),
            this.props.animatedBacterium.top,
        );


        reaction(
            () => this.labelWidth,
            width => this.width.setValue(width),
        );


        // Adjust left by the amount animatedZoom exceeds cappedLabelZoom. As we shrink the label
        // when zoom increases, we have to move in the opposite direction.
        this.left = multiply(
            sub(
                divide(this.props.animatedZoom, this.props.cappedLabelZoom),
                1,
            ),
            this.width,
            0.5,
        );

        // Zoom label out when font would become larger than cappedLabelZoom
        this.cappedLabelZoomAdjustment = divide(
            this.props.cappedLabelZoom,
            this.props.animatedZoom,
        );

    }


    labelLayoutHandler = (ev) => {
        // Make sure we only handle layout once; if not, we might run into an infinite loop.
        if (this.widthSet) return;
        const { width } = ev.nativeEvent.layout;
        this.props.bacterium.setWidth(width);
        this.widthSet = true;
    };

    @computed get labelWidth() {
        // If we don't know the col width yet, use auto so that we can measure the label's real
        // size
        return this.props.matrix.defaultRadius ?
            this.props.matrix.bacteriumLabelColumnWidth * this.props.maxZoom : 'auto';
    }

    @computed get isSelected() {
        return this.props.matrix.activeResistance &&
            this.props.matrix.activeResistance.resistance.bacterium ===
            this.props.bacterium.bacterium;
    }

    /**
     * If the bacterium is in the selected guideline/diagnosis:
     * - Change color of label
     */
    @computed get isInSelectedGuideline() {
        return isBacteriumInSelectedGuideline(
            this.props.bacterium.bacterium,
            this.props.guidelines.getSelectedDiagnosis(),
        );
    }

    /**
     * Return the color for the label dependet on the app state
     */
    @computed get labelColor() {
        if (this.isInSelectedGuideline && !this.isSelected) {
            return styleDefinitions.colors.guidelines.darkBlue;
        } else if (!this.props.bacterium.hasResistanceData) {
            return styleDefinitions.colors.lightForegroundGrey;
        } else {
            return styleDefinitions.colors.black;
        }
    }

    render() {

        log('BacteriumLabel: Render bacterium label');

        // Use a View around the text because Text is not animatable
        return (
            <Animated.View
                style={[
                    styles.labelTextContainer,
                    {
                        width: this.labelWidth,
                        opacity: this.props.animatedBacterium.opacity,
                        paddingRight: this.props.paddingRight || 0,
                        transform: [{
                            scale: this.cappedLabelZoomAdjustment,
                        }, {
                            translateY: this.top,
                        }, {
                            translateX: this.left,
                        }],
                    },
                ]}
            >
                <Text
                    style={[
                        styles.labelText,
                        {
                            color: this.labelColor,
                        },
                    ]}
                    onLayout={this.labelLayoutHandler}>
                    { this.props.bacterium.bacterium.shortName }
                </Text>
            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    labelTextContainer: {
        position: 'absolute',
        right: 0,
        // borderWidth: 1,
        // borderColor: 'pink',
    },
    labelText: {
        ...styleDefinitions.fonts.condensed,
        ...styleDefinitions.label,
        textAlign: 'right',
        // borderWidth: 1,
        // borderColor: 'deeppink',
    },
});
