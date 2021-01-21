import React from 'react';
import { View, StyleSheet, FlatList, TextInput } from 'react-native';
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

        return results
            .map(result => ({
                diagnosis: result.diagnosis,
                matchedSynonym: result.synonym,
            }))
            .sort((a, b) => (a.diagnosis.name < b.diagnosis.name ? -1 : 1));
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
                <FlatList
                    data={this.diagnosisList}
                    style={styles.guidelineList}
                    bounces={false}
                    ItemSeparatorComponent={ () => <View style={styles.listSeparator} /> }
                    ListFooterComponent={ () => <View style={styles.listFooter} /> }
                    keyExtractor={item => `diagnosis_${item.diagnosis.id}`}
                    renderItem={({ item }) => <DiagnosisListItem
                        diagnosis={item.diagnosis}
                        matchedSynonym={item.matchedSynonym}
                        navigation={this.props.navigation}
                        selectedGuideline={this.guidelines.selectedGuideline}
                    />
                    }>
                </FlatList>
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
        paddingTop: 10,
        paddingBottom: 10,
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
    guidelineList: {
        marginTop: 22,
    },
    listSeparator: {
        marginBottom: 22.5,
        marginTop: 22.5,

        borderColor: styleDefinitions.colors.guidelines.darkBlue,
        borderBottomWidth: 1,

        opacity: 0.2,
    },
    listFooter: {
        marginTop: 10,
        marginBottom: 10,
    },
});
