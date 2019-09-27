import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import { DangerZone } from 'expo';
import styleDefinitions from '../../helpers/styleDefinitions';

const { Animated } = DangerZone;

const {
    multiply,
    sub,
    divide,
} = Animated;

@observer
export default class BacteriumLabelHighlightedBackground extends React.Component {

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

    @computed get activeBacteriumBackground() {
        if (this.isInSelectedGuideline) {
            return styleDefinitions.colors.guidelines.ligthBlue;
        }

        return this.isSelected ? styleDefinitions.colors.highlightBackground : 'transparent';
    }

    /**
     * Check if bacterium is in selected guideline
     */
    @computed get isInSelectedGuideline() {
        return this.props.guidelineController.highlightBacterium(this.props.bacterium);
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
            this.props.animatedZoom,
        );
    }

    @computed get top() {
        let top = multiply(
            // Adjust top by the amount animatedZoom exceeds cappedLabelZoom
            divide(this.props.animatedZoom, this.props.cappedLabelZoom),
            this.props.animatedBacterium.top,
        );
        top = sub(top, this.props.layoutElementPadding);
        // top = sub(top, divide(this.height, 2));

        return top;
    }

    render() {
        if (!this.visible) return null;

        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        width: this.labelWidth,
                        height: this.height,
                        opacity: this.opacity,
                        backgroundColor: this.activeBacteriumBackground,
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
