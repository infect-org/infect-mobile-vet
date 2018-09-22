import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import styleDefinitions from '../../helpers/styleDefinitions';
import log from '../../helpers/log';


/**
 * Renders a resistance cirlce with text.
 * TODO: We might improve performance if we only had 1 tap event listener for the whole matrix
 * (instead of one per resistance).
 */
@observer
export default class Resistance extends React.Component {

    // We need to extend small circles; if a small circle contains '100' as susceptibility, 100
    // will break like this:
    // 1
    // 0
    // 0
    // Which is really bad. Android does not support overflow:visible, therefore we have to use
    // a workaround.
    circleMinWidth = 40;

    /**
     * Fucking GestureHandlers don't work here. No idea why. Use old style PanResponder. Even
     * though you're a pain: Thanks for being here, my friend.
     */
    /* panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetResponderCapture: () => false,
        // Moves should go to PanPinch and not be handled by Resistance
        onMoveShouldSetPanResponder: (ev, gestureState) => (
            Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1
        ),
        onResponderTerminationRequest: () => true,
        onMoveShouldSetPanResponderCapture: () => false,
        onPanResponderTerminationRequest: () => true,
        onPanResponderRelease: () => {
            log('Resistance: Update active resistance');
            this.props.matrix.setActiveResistance(this.props.resistance);
        },
    }); */

    @computed get value() {
        const bestValue = this.props.resistance.mostPreciseValue;
        // If bestValue is 1, return 1, else .xx (without leading 0); resistance is between 0 and 1)
        const resistance = bestValue.value === 1 ? 1 : bestValue.value.toFixed(2).substr(1);
        // Return susceptibility, not resistance
        return Math.round((1 - resistance) * 100);
    }

    @computed get position() {
        const xPos = this.props.resistance.xPosition;
        const yPos = this.props.resistance.yPosition;
        const minRadius = this.circleMinWidth / 2;
        const left = xPos.left - minRadius + this.props.matrix.defaultRadius;
        return { left, top: yPos.top, width: this.circleMinWidth };
    }

    @computed get circleBackgroundColor() {
        return { backgroundColor: this.props.resistance.backgroundColor };
    }

    @computed get circleDimensions() {
        const { radius } = this.props.resistance;
        return {
            height: radius * 2,
            width: radius * 2,
            borderRadius: radius,
            top: this.props.matrix.defaultRadius - radius - this.props.matrix.space,
            // Adjust left for this.circleMinWidth
            left: (this.circleMinWidth - (radius * 2)) / 2,
        };
    }

    componentDidMount() {
        // Update amount of rendered resistances in matrix; display loading indicator as long
        // as resistances are not ready.
        this.props.onRender();
    }

    handleTap = () => {
        log('TAPPED');
    }

    render() {

        log('Resistance: Render');

        return (
            <View
                style={[
                    styles.resistance,
                    this.position,
                ]}
            >

                <View style={styles.container}>

                    { /* Only make the circle tappable: The text is wider than the circle as we
                         don't want line breaks or ellipses */ }

                    { /* Circle with background */}
                    <View
                        // { ...this.panResponder.panHandlers }
                        style={[
                            styles.resistanceCircle,
                            this.circleDimensions,
                            this.circleBackgroundColor,
                        ]}
                    />

                    { /* Text */ }
                    <Text
                        pointerEvents="none"
                        style={[
                            styles.resistanceText,
                            /* Use this.circleMinWidth as width so that text doesn't break */
                            { width: this.position.width },
                        ]}
                    >
                        {this.value}
                    </Text>

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    resistance: {
        position: 'absolute',
    },
    resistanceCircle: {
        position: 'absolute',
    },
    resistanceText: {
        ...styleDefinitions.base,
        ...styleDefinitions.label,
        textAlign: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
