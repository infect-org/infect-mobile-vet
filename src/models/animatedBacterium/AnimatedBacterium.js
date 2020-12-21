import { reaction, computed } from 'mobx';
import Animated from 'react-native-reanimated';
import log from '../../helpers/log';


/**
 * Instead of updating the Animated.Values on 1000 resistances, we store the AnimatedValues for all
 * bacteria and share those across all instances that need them.
 */
export default class AnimatedBacterium {

    previousValues = new Map();
    opacity = new Animated.Value(1);
    top = new Animated.Value(0);

    constructor(bacteriumViewModel, matrixViewModel) {
        log('AnimatedBacterium: Init for %o', bacteriumViewModel.bacterium.name);
        this.bacteriumViewModel = bacteriumViewModel;
        this.matrixViewModel = matrixViewModel;

        this.setValue('opacity', this.computedOpacity);
        this.setValue('top', this.computedTop);
        this.setupReactions();
    }

    @computed get yPosition() {
        return this.matrixViewModel.yPositions.get(this.bacteriumViewModel);
    }

    @computed get computedOpacity() {
        return this.bacteriumViewModel.visible ? 1 : 0;
    }

    @computed get computedTop() {
        // AnimatedBacterium is initialized from MainView before matrixView.defaultRadius is set.
        // At this time, top will be NaN – use 0 as NaN is not accepted by Animated.View
        return (
            this.yPosition &&
            !Number.isNaN(this.yPosition.top) &&
            this.yPosition.top !== undefined
        ) ? this.yPosition.top : 0;
    }

    /**
     * Updates this[name] if value is different from previous value.
     */
    setValue(name, newValue) {
        if (this.previousValues.get(name) === newValue) return;
        log('AnimatedBacterium: Update', name, 'to', newValue);
        this.previousValues.set(name, newValue);
        this[name].setValue(newValue);
    }

    setupReactions() {
        reaction(
            () => this.computedOpacity,
            opacity => this.setValue('opacity', opacity),
        );

        reaction(
            () => [this.computedOpacity, this.computedTop],
            (args) => {
                const [opacity, top] = args;

                /**
                 * Only update top value if circle is visible; if it's not, there's no need to
                 * change top position, just leave it where it was
                 */
                if (opacity !== 0) this.setValue('top', top);
            },
        );
    }

}
