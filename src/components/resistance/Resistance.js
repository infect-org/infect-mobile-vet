import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import styleDefinitions from '../../helpers/styleDefinitions';

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

    handleTap() {
        console.log('TAPPED');
    }

    render() {

        return (
            <View
                style={ [
                    styles.resistance,
                    this.position,
                ] }>
                { /* <TapGestureHandler
                    onHandlerStateChange={() => {}}
                > */ }
                { /* Circle with background */}
                <View
                    style={ [
                        styles.resistanceCircle,
                        this.circleDimensions,
                        this.circleBackgroundColor,
                    ] } />
                { /* Text */ }
                <Text
                    style={ [
                        styles.resistanceText,
                        /* Use this.circleMinWidth as width so that text doesn't break */
                        { width: this.position.width },
                    ] }>
                    { this.value }
                </Text>
                { /* </TapGestureHandler> */ }
            </View>
        );
    }

}

const styles = StyleSheet.create({
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
