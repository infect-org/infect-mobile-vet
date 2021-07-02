import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { observer } from 'mobx-react';
import styleDefinitions from '../../helpers/styleDefinitions';
import log from '../../helpers/log';

const radius = 32;

@observer
export default class ResistanceDetail extends React.Component {

    convertToHumanReadableSusceptibility(resistanceNumber) {
        return Math.round((1 - resistanceNumber) * 100);
    }

    render() {

        log('ResistanceDetail: Render');

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
                            backgroundColor: resistance.backgroundColor.toHexString(),
                        },
                    ]}
                />

                <Text
                    style={[
                        styles.text,
                        styles.resistanceText,
                    ]}
                >
                    {resistance.displayValue}
                    {resistance.mostPreciseResistanceTypeIdentifier === 'qualitative' && '%'}
                </Text>
                <Text
                    style={[
                        styles.text,
                        styles.infoText,
                    ]}
                >
                    {resistance.mostPreciseResistanceTypeIdentifier === 'qualitative' &&
                        <React.Fragment>
                            CI {this.convertToHumanReadableSusceptibility(resistance
                                .mostPreciseValue.confidenceInterval[0])}
                            –
                            {this.convertToHumanReadableSusceptibility(resistance.mostPreciseValue
                                .confidenceInterval[1])}
                            %
                        </React.Fragment>
                    }
                    {resistance.mostPreciseResistanceTypeIdentifier === 'mic' && 'MIC90'}
                    {resistance.mostPreciseResistanceTypeIdentifier === 'discDiffusion' &&
                        'Disc Diff.'}
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
        elevation: 3, // Needed for shadow on Android
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
        elevation: 4,
        width: '100%',
    },
    resistanceText: {
        top: 6,
        elevation: 4,
        fontSize: 18,
        marginBottom: 4,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    infoText: {
        // Line height of 1 is enough
        lineHeight: styleDefinitions.label.fontSize * 1.1,
        // Text doesn't go below base line (numbers & caps)
        height: styleDefinitions.label.fontSize * 1.1,
        textAlignVertical: 'center',
        elevation: 4,
        // borderColor: 'salmon',
        // borderWidth: 1,
    },
});
