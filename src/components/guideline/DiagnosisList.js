import React from 'react';
import { View, StyleSheet, FlatList, TextInput } from 'react-native';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';

import styleDefinitions from '../../helpers/styleDefinitions';
import GuidelineHeaderRight from './header/GuidelineHeaderRight.js';
import GuidelineHeaderLeftTitle from './header/GuidelineHeaderLeftTitle.js';
import DiagnosisListItem from './DiagnosisListItem.js';

/**
 * Renders a diagnosis/guideline list.
 * The user could select one and go to the detail view.
 *
 * @extends {React.Component}
 */
@observer
export default class DiagnosisList extends React.Component {

    // Current search term in search filter text input
    @observable searchTerm = '';

    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor: styleDefinitions.colors.guidelines.darkBlue,
        },
        title: null,
        headerLeft: <GuidelineHeaderLeftTitle title="Guidelines" />,
        headerRight: <GuidelineHeaderRight drawer={navigation.getParam('drawer')} />,
    });

    constructor(props) {
        super(props);

        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    }

    @computed get diagnosisList() {

        return this.props.navigation.getParam('guidelines').selectedGuideline.diagnoses
            .filter((diagnosis) => {
                const name = diagnosis.name.toUpperCase();
                const searchTerm = this.searchTerm.toUpperCase();

                return name.indexOf(searchTerm) > -1;
            });
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
                    keyExtractor={item => `diagnosis_${item.id}`}
                    renderItem={({ item, index }) => <DiagnosisListItem
                        diagnosis={item}
                        index={index}
                        navigation={this.props.navigation}
                        drawer={this.props.navigation.getParam('drawer')}
                        selectedGuideline={this.props.navigation.getParam('guidelines').selectedGuideline}
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
