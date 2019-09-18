import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { DangerZone } from 'expo';
import styleDefinitions from '../../helpers/styleDefinitions.js';

const { Animated } = DangerZone;

@observer
export default class BacteriumRowHighlightedBackground extends React.Component {

    height = new Animated.Value(0)
    width = new Animated.Value(0)
    yPosition = new Animated.Value(0)

    alreadyRendered = false

    /**
     * Sets the yPosition of the current highlighted background
     */
    setYPosition() {
        const position = this.props.matrix.yPositions.get(this.props.bacterium);
        this.yPosition.setValue(position.top - this.props.layoutElementPadding);
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
                backgroundColor: styleDefinitions.colors.guidelines.ligthBlue,
                position: 'absolute',
                top: this.yPosition,
            }]
            } />
        );
    }
}
