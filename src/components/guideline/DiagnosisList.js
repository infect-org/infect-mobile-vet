import React from 'react';
import { View, Text, StyleSheet, SectionList, TextInput } from 'react-native';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';

import styleDefinitions from '../../helpers/styleDefinitions';
import DiagnosisListItem from './DiagnosisListItem.js';

/**
 * Renders a diagnosis list.
 * The user could select one and go to the detail view to see recommended
 * therapies for the selected diagnosis.
 * The user then could highlight the relevent antibitics and bateria in the matrix.
 *
 * @extends {React.Component}
 */
export default @observer class DiagnosisList extends React.Component {

    // Current search term in search filter text input
    @observable searchTerm = '';

    constructor(props) {
        super(props);
        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
        this.guidelines = this.props.guidelines;
    }

    @computed get diagnosisList() {
        const results = this.searchTerm ?
            this.guidelines.search(this.searchTerm) :
            this.guidelines.selectedGuideline.diagnoses.map(diagnosis => ({ diagnosis }));

        // Quick fix for specific therapies: All diagnoses belonging to the diagnosisClass with
        // name 'Specific Therapies' are supposed to be specific
        const list = results
            // Sort diagnoses alphabetically
            .sort((a, b) => (a.diagnosis.name < b.diagnosis.name ? -1 : 1))
            // Convert data to a format that can be consumed by SectionList:
            // [{ title: 'Specific|Empirical', data: [{ diagnosis, matchedSynonym }] }]
            .reduce((prev, item) => {
                const index = item.diagnosis.diagnosisClass.name === 'Specific Therapies' ? 1 : 0;
                prev[index].data.push({
                    diagnosis: item.diagnosis,
                    matchedSynonym: item.synonym,
                });
                return prev;
            }, [
                { title: 'Empirical Therapies', data: [] },
                { title: 'Specific Therapies', data: [] },
            ]);

        return list;

    }

    /**
     * Handles onChangeText events fired on the filter search input. Shows and updates search
     * results.
     * @param {String} searchValue   Current input value
     */
    @action.bound handleSearchTextChange(searchValue) {
        this.searchTerm = searchValue;
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.searchFieldContainer}>
                    <TextInput
                        style={styles.searchTextInput}
                        placeholder="Search diagnoses"
                        placeholderTextColor={
                            styleDefinitions.colors.infoTextGray
                        }
                        onChangeText={this.handleSearchTextChange}
                        clearButtonMode="while-editing"
                        // Binding the value makes sure value is reset to '' when
                        // a search result is clicked.
                        value={this.searchTerm}
                    />
                </View>
                <SectionList
                    sections={this.diagnosisList}
                    style={styles.guidelineList}
                    ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                    ListFooterComponent={() => <View style={styles.listFooter} />}
                    keyExtractor={item => `diagnosis_${item.diagnosis.id}`}
                    renderItem={({ item }) => <DiagnosisListItem
                        diagnosis={item.diagnosis}
                        matchedSynonym={item.matchedSynonym}
                        navigation={this.props.navigation}
                        selectedGuideline={this.guidelines.selectedGuideline}
                    />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.listTitle}>{title}</Text>
                    )}
                >
                </SectionList>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: styleDefinitions.colors.guidelines.middleBlue,
    },
    searchFieldContainer: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },
    searchTextInput: {
        ...styleDefinitions.fonts.bold,
        fontSize: 16,
        padding: 10,
        height: 40,
        borderRadius: 5,
        borderColor: styleDefinitions.colors.guidelines.darkBlue,
        color: styleDefinitions.colors.black,
        borderWidth: StyleSheet.hairlineWidth,
    },
    listSeparator: {
        borderColor: styleDefinitions.colors.guidelines.darkBlue,
        borderBottomWidth: 1,
        opacity: 0.2,
    },
    listFooter: {
        marginTop: 10,
        marginBottom: 10,
    },
    listTitle: {
        color: styleDefinitions.colors.black,
        fontSize: styleDefinitions.fontSizes.guidelines.regularText,
        ...styleDefinitions.fonts.bold,
        backgroundColor: styleDefinitions.colors.guidelines.backgroundMiddleBlue,
        paddingLeft: 33,
        paddingTop: 10,
        paddingBottom: 10,
    },
});
