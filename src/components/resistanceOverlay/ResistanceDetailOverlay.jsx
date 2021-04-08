import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
} from 'react-native';
import { observer } from 'mobx-react';
import { resistanceTypes } from '@infect/frontend-logic';
import styleDefinitions from '../../helpers/styleDefinitions.js';
import Histogram from './Histogram.jsx';

const padding = 20;

@observer
export default class ResistanceDetailOverlay extends React.Component {

    render() {
        const { resistance } = this.props.selectedResistance;
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollViewContainer}
                >

                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Susceptibility of {resistance.bacterium.name} to {resistance.antibiotic.name}
                        </Text>
                        { /* <Text style={styles.disclaimerText}>
                            Erklärung, wieso welche Daten angezeigt werden (Text für alle Empfindlichkeiten gleich; Englisch).
                        </Text> */ }
                    </View>

                    <View style={styles.content}>
                        {resistance.getValuesByPrecision().map(value => (
                            <View key={value.type.identifier}>


                                {value.type === resistanceTypes.qualitative &&
                                    <View style={styles.valueTypeContainer}>

                                        <Text style={styles.heading1}>Qualitative Data</Text>

                                        <View style={styles.tableCell}>
                                            <View style={styles.tableCellLeft}>
                                                <Text style={styles.bold}>
                                                    Proportion Susceptible
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellRight}>
                                                <Text style={styles.bold}>
                                                    {Math.round((1 - value.value) * 100)}%{' '}
                                                    {value.susceptible !== undefined &&
                                                        <Text>(N={value.susceptible})</Text>
                                                    }
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.tableCell}>
                                            <View style={styles.tableCellLeft}>
                                                <Text>
                                                    95% Confidence Interval
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellRight}>
                                                <Text>
                                                    {Math.round((1 - value.confidenceInterval[1]) * 100)}–
                                                    {Math.round((1 - value.confidenceInterval[0]) * 100)}%                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.tableCell}>
                                            <View style={styles.tableCellLeft}>
                                                <Text>
                                                    Proportion Intermediate
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellRight}>
                                                <Text>
                                                    {Math.round(value.intermediate / value.sampleSize * 100)}%{' '}
                                                    (N={value.intermediate})
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.tableCell}>
                                            <View style={styles.tableCellLeft}>
                                                <Text>
                                                    Proportion Resistant
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellRight}>
                                                <Text>
                                                    {Math.round(value.resistant / value.sampleSize * 100)}%{' '}
                                                    (N={value.resistant})
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.tableCell}>
                                            <View style={styles.tableCellLeft}>
                                                <Text style={styles.bold}>
                                                    Number of Isolates (N)
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellRight}>
                                                <Text style={styles.bold}>
                                                    {value.sampleSize}
                                                </Text>
                                            </View>
                                        </View>

                                    </View>
                                }

                                {value.type === resistanceTypes.mic &&
                                    <View style={styles.valueTypeContainer}>

                                        <Text style={styles.heading1}>
                                            Quantitative Data (Microdilution)
                                        </Text>

                                        <View style={styles.tableCell}>
                                            <View style={styles.tableCellLeft}>
                                                <Text style={styles.bold}>
                                                    Testing Method
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellRight}>
                                                <Text style={styles.bold}>
                                                    Microdilution
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.tableCell}>
                                            <View style={styles.tableCellLeft}>
                                                <Text>
                                                    MIC90
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellRight}>
                                                <Text>
                                                    {value.quantitativeData.percentileValue} mg/l
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.tableCell}>
                                            <View style={styles.tableCellLeft}>
                                                <Text style={styles.bold}>
                                                    Number of Isolates (N)
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellRight}>
                                                <Text style={styles.bold}>
                                                    {value.sampleSize}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.histogram}>
                                            {value.quantitativeData.percentileValue === undefined &&
                                                <Text>⌛</Text>
                                            }
                                            {value.quantitativeData.percentileValue !== undefined &&
                                                <Histogram
                                                    data={value.quantitativeData.slots}
                                                    xAxisLabel="MIC (mg/l)"
                                                    mic90={value.quantitativeData.percentileValue}
                                                />
                                            }
                                        </View>

                                    </View>

                                }

                                {value.type === resistanceTypes.discDiffusion &&
                                    <View style={styles.valueTypeContainer}>

                                        <Text style={styles.heading1}>
                                            Quantitative Data (Disc Diffusion)
                                        </Text>

                                        <View style={styles.tableCell}>
                                            <View style={styles.tableCellLeft}>
                                                <Text>
                                                    Testing Method
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellRight}>
                                                <Text>
                                                    Disc Diffusion
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.tableCell}>
                                            <View style={styles.tableCellLeft}>
                                                <Text style={styles.bold}>
                                                    Number of Isolates (N)
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellRight}>
                                                <Text style={styles.bold}>
                                                    {value.sampleSize}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.histogram}>
                                            {value.quantitativeData.percentileValue === undefined &&
                                                <Text>⌛</Text>
                                            }
                                            {value.quantitativeData.percentileValue !== undefined &&
                                                <Histogram
                                                    data={value.quantitativeData.slots}
                                                    xAxisLabel="DD (mm)"
                                                    scale="log"
                                                />
                                            }
                                        </View>

                                    </View>
                                }

                            </View>
                        ))}

                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: styleDefinitions.colors.resistances.brightBackground,
    },
    header: {
        backgroundColor: styleDefinitions.colors.resistances.mediumBackground,
        paddingLeft: padding,
        paddingRight: padding,
        paddingTop: padding,
        paddingBottom: padding,
    },
    scrollViewContainer: {},
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    heading1: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    heading2: {
        fontWeight: 'bold',
        paddingTop: padding / 2,
        paddingBottom: padding / 4,
    },
    disclaimerText: {
        paddingTop: padding / 2,
        color: styleDefinitions.colors.resistances.darkBackground,
    },
    content: {
        paddingLeft: padding,
        paddingTop: padding,
        paddingRight: padding,
        paddingBottom: padding,
    },
    tableCell: {
        flexDirection: 'row',
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 100,
        paddingTop: padding / 4,
    },
    tableCellLeft: {
        flex: 3,
    },
    tableCellRight: {
        flex: 2,
    },
    bold: {
        fontWeight: 'bold',
    },
    valueTypeContainer: {
        marginBottom: padding * 1,
        marginTop: padding * 0.5,
    },
    histogram: {
        paddingTop: padding,
        paddingBottom: padding,
    },
});
