import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { observer } from 'mobx-react';
import styleDefinitions from '../../helpers/styleDefinitions';

const radius = 32;

@observer
export default class ResistanceDetail extends React.Component {

    convertToHumanReadableSusceptibility(resistanceNumber) {
        return Math.round((1 - resistanceNumber) * 100);
    }

    render() {

        const resistance = this.props.matrix.activeResistance;

        return (
            <View
                style={[
                    styles.resistanceDetailContainer,
                    {
                        top: resistance.yPosition.top - radius + this.props.matrix.defaultRadius,
                        left: resistance.xPosition.left - radius + this.props.matrix.defaultRadius,
                    },
                ]}
            >

                { /* Circle */ }
                <View
                    style={[
                        styles.resistanceDetailCircle,
                        {
                            backgroundColor: resistance.backgroundColor,
                        },
                    ]}
                />

                <Text
                    style={[
                        styles.text,
                        styles.resistanceText,
                    ]}
                >
                    {
                        this.convertToHumanReadableSusceptibility(resistance.mostPreciseValue.value)
                    }%
                </Text>
                <Text
                    style={[
                        styles.text,
                        styles.infoText,
                    ]}
                >
                    CI {this.convertToHumanReadableSusceptibility(resistance.mostPreciseValue
                        .confidenceInterval[0])}
                    –
                    {this.convertToHumanReadableSusceptibility(resistance.mostPreciseValue
                        .confidenceInterval[1])}
                    %
                </Text>
                <Text
                    style={[
                        styles.text,
                        styles.infoText,
                    ]}
                >
                    N={resistance.mostPreciseValue.sampleSize}
                </Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    resistanceDetailContainer: {
        position: 'absolute',
        width: radius * 2,
        height: radius * 2,
    },
    resistanceDetailCircle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: radius,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.7,
        shadowRadius: 8,
    },
    text: {
        ...styleDefinitions.fonts.condensed,
        ...styleDefinitions.label,
        textAlign: 'center',
        width: '100%',
    },
    resistanceText: {
        top: 6,
        fontSize: 18,
        marginBottom: 4,
    },
    infoText: {
        // Line height of 1 is enough
        lineHeight: styleDefinitions.label.fontSize * 1.1,
        // Text doesn't go below base line (numbers & caps)
        height: styleDefinitions.label.fontSize * 1.1,
        textAlignVertical: 'center',
        // borderColor: 'salmon',
        // borderWidth: 1,
    },
});
