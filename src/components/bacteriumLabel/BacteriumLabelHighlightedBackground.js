import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import Animated, { multiply, sub, divide } from 'react-native-reanimated';
import styleDefinitions from '../../helpers/styleDefinitions';
import isBacteriumInSelectedGuideline from '../guideline/helpers/isBacteriumInSelectedGuideline.js';


export default @observer class BacteriumLabelHighlightedBackground extends React.Component {

    constructor(...props) {
        super(...props);
        this.setupAnimatedProps();
    }

    /**
     * Setup calculated animated values; this can only be done after properties are available.
     */
    setupAnimatedProps() {

        /**
         * Adjust left by the amount animatedZoom exceeds cappedLabelZoom. As we shrink the
         * highlighted background when zoom increases, we have to move in the opposite direction.
         */
        this.left = multiply(
            sub(
                divide(this.props.animatedZoom, this.props.cappedLabelZoom),
                1,
            ),
            this.width,
            0.5,
        );

        /**
         * Zoom highlighted background out when the font of the label
         * would become larger than cappedLabelZoom
         */
        this.cappedLabelZoomAdjustment = divide(
            this.props.cappedLabelZoom,
            this.props.animatedZoom,
        );

    }

    @computed get isSelected() {
        return this.props.matrix.activeResistance &&
            this.props.matrix.activeResistance.resistance.bacterium ===
            this.props.bacterium.bacterium;
    }

    @computed get activeBacteriumBackground() {
        if (this.isInSelectedGuideline) {
            return styleDefinitions.colors.guidelines.ligthBlue;
        }

        return this.isSelected ? styleDefinitions.colors.tenantColor : 'transparent';
    }

    /**
     * Check if bacterium is in selected guideline
     */
    @computed get isInSelectedGuideline() {
        return isBacteriumInSelectedGuideline(
            this.props.bacterium.bacterium,
            this.props.guidelines.getSelectedDiagnosis(),
        );
    }

    @computed get visible() {
        return this.isInSelectedGuideline || this.isSelected;
    }

    /**
     * Returns the background's opacity (bacterium has to be visible, see visible function)
     * - If Bacterium is in selected guideline and resistance is selected return 0.6
     * - else 0.3
     * @return {Number}
     */
    @computed get opacity() {
        if (this.visible) {
            if (this.isInSelectedGuideline && this.isSelected) return 0.6;
            else return 0.3;
        }

        return 0;
    }

    /**
     * Get the height of the current highlighted background
     */
    @computed get height() {
        return multiply(
            this.props.matrix.defaultRadius,
            2,
        );
    }

    /**
     * Get the width of the current highlighted background
     */
    @computed get width() {
        return this.props.matrix.defaultRadius ?
            multiply(
                this.props.matrix.bacteriumLabelColumnWidth,
                this.props.maxZoom,
            ) : 'auto';
    }

    /**
     * Get the top of the current highlighted background
     */
    @computed get top() {
        return sub(this.props.animatedBacterium.top, this.props.layoutElementPadding);
    }

    render() {
        if (!this.visible) return null;

        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        width: this.width,
                        height: this.height,
                        opacity: this.opacity,
                        backgroundColor: this.activeBacteriumBackground,
                        transform: [{
                            translateY: this.top,
                        }, {
                            translateX: this.left,
                        }],
                    },
                ]}
            >
            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        // borderWidth: 1,
        // borderColor: 'pink',
    },
});
