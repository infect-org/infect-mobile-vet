import { reaction, computed } from 'mobx';
import { DangerZone } from 'expo';
import log from '../../helpers/log';

const { Animated } = DangerZone;

/**
 * Instead of updating the Animated.Values on 1000 resistances, we store the AnimatedValues for all
 * antibiotics and bacteria and share those across all instances that need them.
 */
export default class AnimatedAntibiotic {

    previousValues = new Map();
    opacity = new Animated.Value(0);
    left = new Animated.Value(0);

    constructor(antibioticViewModel, matrixViewModel) {
        log('AnimatedAntibiotic: Init for %o', antibioticViewModel.antibiotic.name);
        this.antibioticViewModel = antibioticViewModel;
        this.matrixViewModel = matrixViewModel;

        this.setValue('opacity', this.computedOpacity);
        this.setValue('left', this.computedLeft);
        this.setupReactions();
    }

    @computed get xPosition() {
        return this.matrixViewModel.xPositions.get(this.antibioticViewModel);
    }

    @computed get computedOpacity() {
        return this.xPosition ? 1 : 0;
    }

    @computed get computedLeft() {
        // When matrixView.defaultRadius is not available, xPosition.left might be undefined or
        // NaN. Use 0 in those cases.
        return (
            this.xPosition &&
            !Number.isNaN(this.xPosition.left) &&
            this.xPosition.left !== undefined
        ) ? this.xPosition.left : 0;
    }

    /**
     * Updates this[name] if value is different from previous value.
     */
    setValue(name, newValue) {
        if (this.previousValues[name] === newValue) return;
        log('AnimatedAntibiotic: Update', name, 'to', newValue);
        this.previousValues.set(name, newValue);
        this[name].setValue(newValue);
    }

    setupReactions() {
        reaction(
            () => this.computedOpacity,
            opacity => this.setValue('opacity', opacity),
        );
        reaction(
            () => this.computedLeft,
            // Only update left value if circle is visible; if it's not, there's no need to
            // change left position, just leave it where it was
            left => this.computedOpacity && this.setValue('left', left),
        );
    }

}
