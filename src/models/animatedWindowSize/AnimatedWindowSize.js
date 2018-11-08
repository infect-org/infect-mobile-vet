import { DangerZone } from 'expo';
import { observable, action } from 'mobx';
import log from '../../helpers/log';

const { Animated } = DangerZone;

export default class AnimatedWindowSize {

    // Animated values that we can reference anywhere to update layout whenever device orientation
    // changes
    animatedHeight = new Animated.Value(0);
    animatedWidth = new Animated.Value(0);

    // Regular mobx observables that we can use to read/get the current value – this is not possible
    // with Animated.Value()
    @observable height = 0;
    @observable width = 0;

    @action update(dimensions) {
        if (dimensions === undefined) {
            throw new Error('AnimatedWindowSize: dimensions argument missing in update method.');
        }
        if (Number.isNaN(dimensions.height) || Number.isNaN(dimensions.width)) {
            throw new Error(`AnimatedWindowSize: dimensions' height or width is not a number: ${dimensions.height}/${dimensions.width}.`);
        }
        if (dimensions.width === this.width && dimensions.height === this.height) return;
        log('AnimatedWindowSize: Dimensions are', dimensions);

        this.animatedWidth.setValue(dimensions.width);
        this.animatedHeight.setValue(dimensions.height);
        this.height = dimensions.height;
        this.width = dimensions.width;
    }

}
