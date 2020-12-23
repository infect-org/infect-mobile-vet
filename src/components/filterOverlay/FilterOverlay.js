import React from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
    ScrollView,
    Linking,
    Button,
    TextInput,
} from 'react-native';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import log from '../../helpers/log.js';
import styleDefinitions from '../../helpers/styleDefinitions.js';
import AntibioticFilters from './AntibioticFilters.js';
import BacteriaFilters from './BacteriaFilters.js';
import PopulationFilters from './PopulationFilters.js';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle.js';
import FilterOverlaySearchResults from '../filterOverlaySearchResults/FilterOverlaySearchResults.js';
import AnimalFilters from './AnimalFilters.js';

import GuidelineFilters from './GuidelineFilters.js';

const padding = 20;

/**
 * View for the overlay that opens when filter button is tapped. Contains:
 * - filters for antibitotics, bacteria, population
 * - two HorizontalPanes for a two level deep navigation through filters (long lists are split
 *   into a second dimension)
 * - an about text and link
 * - a button to remove all filters and close the overlay
 */
@observer
export default class FilterOverlay extends React.Component {

    // Current search term in search filter text input
    @observable searchTerm = '';

    constructor(props) {
        super(props);
        // props.componentStates.update('filters', componentStates.ready);
        this.openDisclaimer = this.openDisclaimer.bind(this);
        this.closeOverlay = this.closeOverlay.bind(this);
        this.removeAllFilters = this.removeAllFilters.bind(this);
        this.changeDetailPanelContent = this.changeDetailPanelContent.bind(this);
    }

    /* componentDidMount() {
        log('FilterOverlay: Mounted');
        this.props.componentStates.update('filters', componentStates.ready);
    } */

    /**
     * Resets search term to ''. We should try not modify properties from the outside, therefore
     * we pass this method to our children.
     */
    @action resetSearchTerm() {
        this.searchTerm = '';
    }

    removeAllFilters() {
        this.props.selectedFilters.removeAllFilters();
    }

    openDisclaimer() {
        Linking.openURL('https://infect.info/#information');
    }

    closeOverlay() {
        this.props.navigation.navigate('Main');
    }

    @computed get showResetAllFiltersButton() {
        return this.props.selectedFilters.originalFilters.length > 0;
    }

    changeDetailPanelContent(content) {
        this.props.navigation.navigate('MatrixFilters', {
            screen: 'FilterDetail',
            params: {
                filterType: content,
            },
        });
    }

    /**
     * Handles onChangeText events fired on the filter search input. Shows and updates search
     * results.
     * @param {String} searchText   Current input value
     */
    @action.bound handleSearchTextChange(searchText) {
        this.searchTerm = searchText;
    }

    render() {

        log('FilterOverlay: Render');

        return (
            <View style={styles.filterOverlay}>

                { /* Filter list (main filters) */ }
                <View style={styles.filterOverlayMainContent}>

                    <View style={styles.searchTextInputContainer}>
                        <TextInput
                            style={ styles.searchTextInput}
                            placeholder="Search filters"
                            placeholderTextColor={
                                styleDefinitions.colors.lightForegroundGrey
                            }
                            onChangeText={this.handleSearchTextChange}
                            clearButtonMode="while-editing"
                            // Binding the value makes sure value is reset to '' when
                            // a search result is clicked.
                            value={this.searchTerm}
                        />
                    </View>


                    { /* If no search terrm was entered, display list of all available
                            filters */ }
                    { this.searchTerm === '' &&
                        <ScrollView>

                            { /* Remove all filters */ }
                            { this.showResetAllFiltersButton &&
                                <TouchableWithoutFeedback
                                    onPress={this.removeAllFilters}
                                >
                                    <View style={styles.removeFiltersButton}>
                                        <View
                                            style={
                                                styleDefinitions.buttons.textContainer
                                            }
                                        >
                                            <Text style={
                                                styleDefinitions.buttons.secondaryText
                                            }>
                                                × Remove all filters
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            }

                            <GuidelineFilters
                                guidelines={this.props.guidelines}
                                guidelineRelatedFilters={this.props.guidelineRelatedFilters}
                            />

                            <AnimalFilters
                                filterValues={this.props.filterValues}
                                selectedFilters={this.props.selectedFilters}
                            />

                            <AntibioticFilters
                                filterValues={this.props.filterValues}
                                selectedFilters={this.props.selectedFilters}
                                changeDetailPanelContent={this.changeDetailPanelContent}
                            />

                            <BacteriaFilters
                                filterValues={this.props.filterValues}
                                selectedFilters={this.props.selectedFilters}
                                changeDetailPanelContent={this.changeDetailPanelContent}
                            />

                            <PopulationFilters
                                filterValues={this.props.filterValues}
                                selectedFilters={this.props.selectedFilters}
                            />

                            <View style={{ height: 20 }} />

                            <FilterOverlayTitle
                                title="Information" />

                            <Text style={styles.infoText}>
                                Monthly, INFECT imports a subset of the latest 365
                                days of bacterial resistance data from the Swiss Center
                                for Antibiotic resistance.
                            </Text>
                            <Text style={styles.infoText}>
                                INFECT accepts no responsibility or liability with
                                regard to any problems incurred as a result of using
                                this site or any linked external sites.
                            </Text>
                            <View style={styles.infoButtonContainer}>
                                <Button
                                    onPress={this.openDisclaimer}
                                    color={styleDefinitions.colors.tenantColor}
                                    title="More information"
                                    style={styles.infoButton}
                                />
                            </View>

                            { /* Add margin to bottom of container (that's covered by
                                    «Apply filters» button) */ }
                            <View style={styles.bottomMarginContainer} />

                        </ScrollView>
                    }


                    { /* If search term was entered, display all filters that match
                            the search term */ }
                    { this.searchTerm !== '' &&
                        <ScrollView
                            keyboardShouldPersistTaps="always"
                        >
                            { /* Default for keyboardShouldPersistTaps is "never" which
                                    requires two taps on a search result: 1st closes the
                                    keyboard, 2nd selects result. "always" selects result
                                    on 1st tap but does not close keyboard. This has to be
                                    done manually (see FilterOverlaySearchResults) */ }

                            <FilterOverlaySearchResults
                                searchTerm={this.searchTerm}
                                resetSearchTerm={this.resetSearchTerm.bind(this)}
                                filterValues={this.props.filterValues}
                                selectedFilters={this.props.selectedFilters}
                            />

                            { /* Add margin to bottom of container (that's covered by
                                    «Apply filters» button) */ }
                            <View style={styles.bottomMarginContainer} />

                        </ScrollView>
                    }


                </View>

                { /* Apply filters button */ }
                { /* <View style={styles.applyFiltersButtonContainer}>
                    <TouchableWithoutFeedback
                        onPress={this.closeOverlay}
                        style={styles.container}
                    >
                        <View style={styles.applyFiltersButton}>
                            <View style={styles.applyFiltersButtonTextContainer}>
                                <Text style={styles.applyFiltersButtonText}>
                                    Apply filters
                                </Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View> */ }

            </View>
        );
    }

}

const styles = StyleSheet.create({
    applyFiltersButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        height: 60,
        // borderColor: 'skyblue',
        // borderWidth: 1,
    },
    bottomMarginContainer: {
        height: 80,
        width: '100%',
    },
    removeFiltersButton: {
        margin: padding,
        ...styleDefinitions.buttons.secondaryButton,
        backgroundColor: styleDefinitions.colors.tenantColor,
    },
    applyFiltersButton: {
        position: 'absolute',
        left: padding,
        right: padding,
        top: 0,
        backgroundColor: styleDefinitions.colors.tenantColor,
        ...styleDefinitions.buttons.primaryButton,
        ...styleDefinitions.shadows.primaryButton,
    },
    applyFiltersButtonTextContainer: {
        ...styleDefinitions.buttons.textContainer,
    },
    applyFiltersButtonText: {
        ...styleDefinitions.buttons.primaryText,
    },
    filterOverlay: {
        flex: 1,
        backgroundColor: styleDefinitions.colors.darkBackgroundGrey,
    },
    filterOverlayMainContent: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        // borderWidth: 2,
        // borderColor: 'pink',
    },
    filterOverlayDetailContent: {
        width: '100%',
        height: 50,
        position: 'absolute',
        left: '100%',
        // top: 0,
        // backgroundColor: 'coral',
    },
    infoText: {
        marginLeft: padding,
        marginRight: padding,
        color: styleDefinitions.colors.white,
        ...styleDefinitions.fonts.condensed,
    },
    infoButtonContainer: {
        // Margins needed for android, button has a background; are not applied to button itself,
        // must therefore be part of a container
        marginLeft: padding,
        marginRight: padding,
        marginTop: 5,
    },
    infoButton: {
        ...styleDefinitions.fonts.bold,
    },
    container: {
        flex: 1,
    },
    searchTextInputContainer: {
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: padding,
        paddingRight: padding,
    },
    searchTextInput: {
        ...styleDefinitions.fonts.bold,
        fontSize: 16,
        padding: 10,
        height: 40,
        borderColor: styleDefinitions.colors.lightForegroundGrey,
        color: styleDefinitions.colors.white,
        borderWidth: StyleSheet.hairlineWidth,
    },
});
