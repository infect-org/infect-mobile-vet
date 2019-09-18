import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { DangerZone } from 'expo';
import styleDefinitions from '../../helpers/styleDefinitions.js';

const { Animated } = DangerZone;

@observer
export default class AntibioticColumnHighlightedBackground extends React.Component {

    height = new Animated.Value(0)
    width = new Animated.Value(0)
    xPosition = new Animated.Value(0)

    alreadyRendered = false

    /**
     * Sets the xPosition of the current highlighted background
     */
    setXPosition() {
        const position = this.props.matrix.xPositions.get(this.props.antibiotic);
        this.xPosition.setValue(position.left);
    }

    /**
     * Sets the height of the current highlighted background
     */
    setHeight() {
        this.height.setValue(this.props.matrix.visibleBacteriaHeight +
            this.props.matrix.spaceBetweenGroups);
    }

    /**
     * Sets the width of the current highlighted background
     */
    setWidth() {
        this.width.setValue(this.props.matrix.defaultRadius * 2);
    }

    /**
     * Returns therapies (from selected guideline/diagnosis) that the current antibiotic is
     * recommended for.
     * @return {[Therapy]}
     */
    @computed get selectedTherapiesForAntibiotic() {
        const diagnosis = this.props.guidelines &&
            this.props.guidelines.selectedGuideline &&
            this.props.guidelines.selectedGuideline.selectedDiagnosis;
        if (!diagnosis) return [];
        return diagnosis.therapies
            .filter(therapy => therapy.containsAntibiotic(this.props.antibiotic.antibiotic));
    }

    /**
     * Returns true if antibiotic is contained in any one therapy that belongs to the currently
     * selected diagnosis and it's not filtered
     * @return {Boolean}    Visiblity of the highlighted background
     */
    @computed get visible() {
        return this.props.guidelineController.highlightAntibiotic(this.props.antibiotic);
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

        if (this.alreadyRendered === false) {
            this.setWidth();
            this.setHeight();
            this.setXPosition();

            this.alreadyRendered = true;
        }

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
