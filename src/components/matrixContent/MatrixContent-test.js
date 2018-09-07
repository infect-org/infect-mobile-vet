import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

export default class Box extends React.Component {

    render() {
        return (
            <Animated.View
                style={[styles.box, {
                    // props.animatedLeft, props.animatedTop and props.animatedZoom were added
                    // to this component by PanPinch. They are all of type Animated.Node.
                    transform: [{
                        translateX: this.props.animatedLeft,
                    }, {
                        translateY: this.props.animatedTop,
                    }, {
                        scale: this.props.animatedZoom,
                    }],
                }]}
            />
        );
    }

}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'tomato',
        position: 'absolute',
        left: 20,
        top: 20,
        width: 200,
        height: 200,
    },
});
