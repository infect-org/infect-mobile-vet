import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { trace, reaction } from 'mobx';
import { DangerZone } from 'expo';
import log from '../../helpers/log';

const { Animated } = DangerZone;

@observer
export default class SubstanceClassHeaderItem extends React.Component {

    left = new Animated.Value(0);
    width = new Animated.Value(0);
    opacity = new Animated.Value(0);

    constructor(...props) {
        super(...props);

        const { xPosition } = this.props.substanceClass;
        this.updateAnimatedValues(xPosition);

        reaction(
            () => xPosition,
            newXPosition => this.updateAnimatedValues(newXPosition),
        );
    }

    updateAnimatedValues(newXPosition) {
        this.left.setValue(newXPosition ? newXPosition.left : 0);
        this.width.setValue(newXPosition ? newXPosition.right - newXPosition.left : 0);
        this.opacity.setValue(newXPosition ? 1 : 0);
    }

    /**
     * Converts a substanceClass' color object to a CSS RGB string. Returns gray if substanceClass
     * doesn't have a color.
     * @param {Object} color       Object with properties r, g, b
     * @return {String}
     */
    getBackgroundColorString(colorObject) {
        if (!colorObject) return 'rgb(100, 100, 100)';
        return `rgb(${colorObject.r}, ${colorObject.g}, ${colorObject.b})`;
    }


    render() {

        log('SubstanceClassHeaderItem: Render');
        trace();

        // substanceClass has no xPosition if it's not visible (because of filters). Make sure we
        // don't access child properties of xPosition if substanceClass is invisible.

        const backgroundColor = this.getBackgroundColorString(
            this.props.substanceClass.substanceClass.color,
        );

        /* log(
            'SubstanceClassHeaderItem: xPosition is',
            xPosition,
            'left',
            left,
            'width',
            width,
            'opacity',
            opacity,
            'backgroundColor',
            backgroundColor,
        ); */

        return (
            <Animated.View
                style={[
                    styles.substanceClassHeader,
                    {
                        backgroundColor,
                        width: this.width,
                        left: this.left,
                        height: this.props.height,
                        opacity: this.opacity,
                    },
                ]}
            />
        );
    }

}

const styles = StyleSheet.create({
    substanceClassHeader: {
        top: 0, // We can't go below 0, Android has no overflow: visible
        position: 'absolute',
        // borderWidth: 1,
        // borderColor: 'deeppink',
    },
});
