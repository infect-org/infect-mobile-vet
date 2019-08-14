import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { DangerZone } from 'expo';

const { Animated } = DangerZone;

const {
    multiply,
    sub,
    add,
    divide,
} = Animated;

@observer
export default class BacteriumRowHighlightedBackground extends React.Component {

    height = new Animated.Value(0)
    width = new Animated.Value(0)
    yPosition = new Animated.Value(0)

    alreadyRendered = false

    /**
     * Get the top position of the current highlighted background
     * @returns {Animated}
     */
    @computed get top() {
        return add(
            sub(this.props.animatedBacterium.top, this.props.layoutElementPadding),
            this.props.topRowHeight,
        );
    }

    /**
     * Get the yPosition of the current highlighted background
     * @returns {Animated}
     */
    getYPosition() {
        const position = this.props.matrix.yPositions.get(this.props.bacterium);
        return Animated.add(
            position.top - this.props.layoutElementPadding,
            this.props.topRowHeight,
        );
    }

    /**
     * Sets the yPosition of the current highlighted background
     */
    setYPosition() {
        this.yPosition.setValue(this.getYPosition());
    }

    /**
     * Sets the height of the current highlighted background
     */
    setHeight() {
        this.height.setValue(this.props.matrix.defaultRadius * 2);
    }

    /**
     * Sets the width of the current highlighted background
     */
    setWidth() {
        this.width.setValue(this.props.matrix.bacteriumLabelColumnWidth +
            this.props.matrix.spaceBetweenGroups +
            this.props.matrix.visibleAntibioticsWidth);
    }

    /**
     * Only display highlighted background if a guideline and diagnosis were selected, if the
     * bacterium is visible (filters match bacterium), if the current bacterium induces the
     * diagnosis and it's not filtered
     * @return {Boolean}
     */
    @computed get visible() {
        return this.props.guidelineController.highlightBacterium(this.props.bacterium);
    }

    /**
     * Returns the background's opacity (0 if this.visible is false)
     * @return {Number}
     */
    @computed get opacity() {
        return this.visible ? 1 : 0;
    }

    render() {
        if (!this.visible) return null;

        if (this.alreadyRendered === false) {
            this.setWidth();
            this.setHeight();
            this.setYPosition();

            this.alreadyRendered = true;
        }

        return (
            <Animated.View style={[{
                height: this.height,
                width: this.width,
                opacity: 0.3,
                backgroundColor: '#A7CCEB',
                position: 'absolute',
                top: this.top,
            }]
            } />
        );
    }
}
