import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import Animated, { multiply, add } from 'react-native-reanimated';
import styleDefinitions from '../../helpers/styleDefinitions.js';
import isAntibioticInSelectedGuideline from '../guideline/helpers/isAntibioticInSelectedGuideline.js';


/**
 * Blue highlight for antibiotics that may be used to treat a certain diagnosis.
 */
@observer
export default class AntibioticColumnHighlightedBackground extends React.Component {

    /**
     * Get the xPosition of the current highlighted background
     */
    @computed get xPosition() {
        const position = this.props.matrix.xPositions.get(this.props.antibiotic);
        return position.left;
    }

    /**
     * Get the height of the current highlighted background
     */
    @computed get height() {
        return add(
            this.props.matrix.visibleBacteriaHeight,
            this.props.matrix.spaceBetweenGroups,
        );
    }

    /**
     * Get the width of the current highlighted background
     */
    @computed get width() {
        return multiply(this.props.matrix.defaultRadius, 2);
    }

    /**
     * Returns therapies (from selected guideline/diagnosis) that the current antibiotic is
     * recommended for.
     * @return {[Therapy]}
     */
    @computed get selectedTherapiesForAntibiotic() {
        const diagnosis = this.props.guidelines.getSelectedDiagnosis();
        if (!diagnosis) return [];

        return diagnosis.therapies
            .filter(therapy => therapy.containsAntibiotic(this.props.antibiotic.antibiotic));
    }

    /**
     * Returns true if antibiotic is contained in any one therapy that belongs to the currently
     * selected diagnosis
     * @return {Boolean}    Visiblity of the highlighted background
     */
    @computed get visible() {
        return isAntibioticInSelectedGuideline(
            this.props.antibiotic.antibiotic,
            this.props.guidelines.getSelectedDiagnosis(),
        );
    }

    /**
     * Opacity for therapies with priority order 1 should be more opaque.
     * @return {Number}     Opacity for the highlight depending on matching therapy's priorty
     */
    @computed get opacity() {
        const priorities = this.selectedTherapiesForAntibiotic
            .map(therapy => therapy.priority.order);
        return priorities.includes(1) ? 0.8 : 0.3;
    }

    render() {
        if (!this.visible) return null;

        return (
            <Animated.View style={[{
                height: this.height,
                width: this.width,
                opacity: this.opacity,
                backgroundColor: styleDefinitions.colors.guidelines.ligthBlue,
                position: 'absolute',
                left: this.xPosition,
            }]
            } />
        );
    }
}
