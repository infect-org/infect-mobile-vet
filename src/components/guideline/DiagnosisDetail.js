import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import Markdown from 'react-native-markdown-renderer';

import styleDefinitions from '../../helpers/styleDefinitions';
import GuidelineHeaderRight from './header/GuidelineHeaderRight.js';
import GuidelineHeaderLeftBack from './header/GuidelineHeaderLeftBack.js';
import CurrentResistanceButton from './CurrentResistanceButton.js';

/**
 * Renders the detail view of a diagnosis.
 * The diagnosis could be selected from the user to highlight the matrix view with
 * the recommended resistances
 *
 * @extends {React.Component}
 */
@observer
export default class DiagnosisDetail extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor: styleDefinitions.colors.guidelines.darkBlue,
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
        },
        title: navigation.getParam('diagnosis').name,
        headerRight: <GuidelineHeaderRight drawer={navigation.getParam('drawer')} />,
        headerLeft: <GuidelineHeaderLeftBack navigation={navigation}/>,
    });

    render() {
        const diagnosis = this.props.navigation.getParam('diagnosis');
        const selectedGuideline = this.props.navigation.getParam('selectedGuideline');
        const drawer = this.props.navigation.getParam('drawer');

        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.diagnosisClass}>
                        {diagnosis.diagnosisClass.name}
                    </Text>
                    <Text style={styles.guidelineName}>
                        {selectedGuideline.name}
                    </Text>
                    <Markdown>
                        {selectedGuideline.markdownDisclaimer}
                    </Markdown>

                    <View style={styles.therapyList}>
                        {diagnosis.therapies.map(therapy =>
                            <View
                                key={therapy.id}
                                style={styles.therapyListItem}
                            >
                                <View style={styles.therapyHeader}>
                                    <View style={styles.therapyHeaderOrderView}>
                                        <Text style={styles.therapyHeaderOrder}>
                                            {therapy.priority.order}
                                        </Text>
                                    </View>

                                    <View style={styles.therapyHeaderNameView}>
                                        <Text style={styles.therapyHeaderName}>
                                            {therapy.priority.name}
                                        </Text>
                                    </View>
                                </View>

                                {therapy.recommendedAntibiotics.map(antibiotic =>
                                    <View
                                        key={antibiotic.id}
                                    >
                                        <Text style={styles.antibioticName}>
                                            {antibiotic.antibiotic.name}
                                        </Text>
                                        <Markdown>
                                            {antibiotic.markdownText}
                                        </Markdown>
                                    </View>)}

                                <Markdown>
                                    {therapy.markdownText}
                                </Markdown>

                            </View>)}
                    </View>

                    <View>
                        <Text>Datenquelle: Tobi</Text>
                        <Text>Stand: Heute</Text>
                    </View>
                </ScrollView>
                <View style={styles.currentResistanceButtonContainer}>
                    <CurrentResistanceButton
                        selectedGuideline={selectedGuideline}
                        diagnosis={diagnosis}
                        drawer={drawer}
                    />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: styleDefinitions.colors.guidelines.middleBlue,

        paddingLeft: 35,
        paddingRight: 27,
    },
    currentResistanceButtonContainer: {
        height: 50,
        width: 208,
        position: 'absolute',
        right: 16.7,
        bottom: 64,
    },
    diagnosisClass: {
        fontSize: 14,
        marginTop: 18,
    },
    guidelineName: {
        fontSize: 14,
        fontWeight: 'bold',

        marginBottom: 20,
    },
    antibioticName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    guidelineMarkdown: {
        marginBottom: 22,
    },
    therapyList: {
        marginTop: 22,
    },
    therapyListItem: {
        marginBottom: 22,
    },
    therapyHeader: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
    },
    therapyHeaderOrderView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,

        backgroundColor: styleDefinitions.colors.guidelines.darkBlue,
        borderRadius: 15,

        marginRight: 10,
    },
    therapyHeaderOrder: {
        fontSize: 16,
        color: '#FFF',
    },
    therapyHeaderNameView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
    },
    therapyHeaderName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: styleDefinitions.colors.guidelines.darkBlue,
    },
    antibioticMarkdown: {

    },
    therapyMarkdown: {

    },
});
