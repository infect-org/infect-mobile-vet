import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import log from '../../helpers/log';

@observer
export default class SubstanceClassHeaderItem extends React.Component {

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

        // substanceClass has no xPosition if it's not visible (because of filters). Make sure we
        // don't access child properties of xPosition if substanceClass is invisible.
        const { xPosition } = this.props.substanceClass;
        const left = xPosition ? xPosition.left : 0;
        const width = xPosition ? xPosition.right - xPosition.left : 0;
        const opacity = xPosition ? 1 : 0;
        const backgroundColor = this.getBackgroundColorString(
            this.props.substanceClass.substanceClass.color,
        );
        log(
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
        );

        return (
            <View
                style={[
                    styles.substanceClassHeader,
                    {
                        backgroundColor,
                        width,
                        left,
                        height: this.props.height,
                        opacity,
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
