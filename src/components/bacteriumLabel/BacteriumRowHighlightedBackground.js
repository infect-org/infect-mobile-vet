import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import Animated, { multiply, add, sub } from 'react-native-reanimated';
import styleDefinitions from '../../helpers/styleDefinitions.js';
import isBacteriumInSelectedGuideline from '../guideline/helpers/isBacteriumInSelectedGuideline.js';


/**
 * Blue highlight for bacteria that may cause a certain diagnosis
 */
export default @observer class BacteriumRowHighlightedBackground extends React.Component {

    /**
     * Get the yPosition of the current highlighted background
     */
    @computed get yPosition() {
        const position = this.props.matrix.yPositions.get(this.props.bacterium);
        return sub(position.top, this.props.layoutElementPadding);
    }

    /**
     * Get the height of the current highlighted background
     */
    @computed get height() {
        return multiply(this.props.matrix.defaultRadius, 2);
    }

    /**
     * Get the width of the current highlighted background
     */
    @computed get width() {
        return add(
            this.props.matrix.bacteriumLabelColumnWidth,
            this.props.matrix.spaceBetweenGroups,
            this.props.matrix.visibleAntibioticsWidth);
    }

    /**
     * Only display highlighted background if a guideline and diagnosis were selected, if the
     * bacterium is visible (filters match bacterium), if the current bacterium induces the
     * diagnosis
     * @return {Boolean}
     */
    @computed get visible() {
        return isBacteriumInSelectedGuideline(
            this.props.bacterium.bacterium,
            this.props.guidelines.getSelectedDiagnosis(),
        );
    }

    render() {
        if (!this.visible) return null;

        return (
            <Animated.View
                style={[{
                    height: this.height,
                    width: this.width,
                    opacity: 0.3,
                    backgroundColor: styleDefinitions.colors.guidelines.ligthBlue,
                    position: 'absolute',
                    top: this.yPosition,
                }]} />
        );
    }
}
