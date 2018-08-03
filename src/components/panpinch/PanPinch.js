import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const { event, sub, block, set, Value, cond, debug, eq, Clock, stopClock, clockRunning, Extrapolate, add, greaterThan, min, max, startClock, timing, interpolate } = Animated;

const { width, height } = Dimensions.get('window');
console.log('window width %o, height %o', width, height);

/**
 * Pan and pinch handler. 
 * - Renders children passed to it. 
 * - Pass in variables (Animated.Value for react-native-reanimated) for left, top and zoom; they 
 *   will be updated and can be used in child components.
 * - Re-render/initialize component when layout changes! (As we only measure layout on init of the
 *   component)
 */
export default class PanPinch extends React.Component {

	panState = new Value(-1);
	// Current transformation (prev + current) to temporarily store result
	transX = new Value(0);
	transY = new Value(0);
	// Previous drag positions
	prevDragX = new Value(0);
	prevDragY = new Value(0);
	// Current drag positions (from pan event)
	dragX = new Value(0);
	dragY = new Value(0);

    resultingTranslation = cond(
        eq(this.panState, State.ACTIVE),
        [
            set(this.transX, add(this.transX, sub(this.dragX, this.prevDragX))),
            set(this.prevDragX, this.dragX),
            this.transX,
        ],
        [
            set(this.prevDragX, 0),
            this.transX,
        ],
    );

    /*left = interpolate(this.resultingTranslation, {
        inputRange: [0, width - 200],
        outputRange: [0, width - 200],
        extrapolate: Extrapolate.CLAMP,
    });*/

	onStateChange = event([{
		nativeEvent: {
			state: this.panState,
		}
	}]);

	onPanGestureEvent = event([{
		nativeEvent: {
			translationX: this.dragX,
		}
	}]);

	render() {
		console.log('RENDERING', this.resultingTranslation, this.panState);
		return (
			<View style={styles.container}>
				{ /* Only render stuff when we know the window's dimensions, needed to cap */ }
				<PanGestureHandler 
                    onGestureEvent={ this.onPanGestureEvent }
                    >
                    <View style={ styles.container }>
                        <Text>test</Text>
                        <Animated.View style={ [styles.box, 
                            {
                                transform: [{
                                    translateX: this.resultingTranslation,
                                }] 
                            }
                        ] }
                        />
                    </View>
				</PanGestureHandler>
			</View>
		);
	}

}

const styles = StyleSheet.create({
    // Style for a container that uses all space available
	container: {
		width: '100%',
		flex: 1,
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
    box: {
        backgroundColor: "tomato",
        borderColor: 'yellow',
        borderWidth: 5,
        width: 200,
        height: 200,
    },
});


