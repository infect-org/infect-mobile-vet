import { reaction, computed } from 'mobx';
import Animated from 'react-native-reanimated';
import log from '../../helpers/log';


/**
 * Instead of updating the Animated.Values on 1000 resistances, we store the AnimatedValues for all
 * antibiotics and bacteria and share those across all instances that need them.
 */
export default class AnimatedAntibiotic {

    previousValues = new Map();
    opacity = new Animated.Value(1);
    left = new Animated.Value(0);

    constructor(antibioticViewModel, matrixViewModel) {
        log('AnimatedAntibiotic: Init for %o', antibioticViewModel.antibiotic.name);
        this.antibioticViewModel = antibioticViewModel;
        this.matrixViewModel = matrixViewModel;
        this.setupReactions();
    }

    @computed get xPosition() {
        return this.matrixViewModel.xPositions.get(this.antibioticViewModel);
    }

    @computed get computedOpacity() {
        return this.antibioticViewModel.visible ? 1 : 0;
    }    

    @computed get computedLeft() {
        // When matrixView.defaultRadius is not available, xPosition.left might be undefined or
        // NaN. Use 0 in those cases.
        const left = this.matrixViewModel.defaultRadius && this.xPosition ? this.xPosition.left : 0;
        return left;
    }

    setupReactions() {
        reaction(
            () => this.computedLeft,
            computedLeft => this.left.setValue(computedLeft),
        );
        reaction(
            () => this.computedOpacity,
            (computedOpacity) => {
                this.opacity.setValue(computedOpacity);
            },
        );
    }

}
