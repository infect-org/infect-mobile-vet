import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { observer } from 'mobx-react';
import Matrix from '../matrix/Matrix';
import FilterOverlay from '../filterOverlay/FilterOverlay';
import FilterButton from '../filterButton/FilterButton';
import log from '../../helpers/log';
import componentStates from '../../models/componentStates/componentStates';

@observer
export default class MainView extends React.Component {

    constructor(...props) {
        super(...props);
        this.addAntibioticFilter = this.addAntibioticFilter.bind(this);
        this.addBacteriumFilter = this.addBacteriumFilter.bind(this);
    }

    addAntibioticFilter() {
        const antibiotics = this.props.filterValues.getValuesForProperty('antibiotic', 'name');
        if (antibiotics.length) {
            const antibiotic = antibiotics[0];
            if (this.props.selectedFilters.isSelected(antibiotic)) {
                this.props.selectedFilters.removeFilter(antibiotic);
            } else {
                this.props.selectedFilters.addFilter(antibiotic);
            }
        }
    }

    addBacteriumFilter() {
        const bacteria = this.props.filterValues.getValuesForProperty('bacterium', 'name');
        if (bacteria.length) {
            const bacterium = bacteria[0];
            if (this.props.selectedFilters.isSelected(bacterium)) {
                this.props.selectedFilters.removeFilter(bacterium);
            } else {
                this.props.selectedFilters.addFilter(bacterium);
            }
        }
    }


    render() {

        log('MainView: Render');

        return (
            <View style={styles.container}>
                <Matrix
                    style={styles.matrix}
                    matrix={this.props.matrix}
                    selectedFilters={this.props.selectedFilters}
                    componentStates={this.props.componentStates}
                />

                { /* Filter overlay button; no feedback needed as it opens overlay and
                     TouchableHighlight flickers on click (maybe because of shadow) */ }
                <View style={styles.filterButtonContainer} >
                    <FilterButton
                        matrix={this.props.matrix}
                        filterOverlayModel={this.props.filterOverlayModel}
                    />
                </View>

                { /* Just for testing (adds antibiotic to filters */ }
                <TouchableHighlight onPress={this.addAntibioticFilter}>
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: 'navy',
                            position: 'absolute',
                            bottom: 20,
                            left: 20,
                        }}
                    />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.addBacteriumFilter}>
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: 'salmon',
                            position: 'absolute',
                            bottom: 20,
                            left: 50,
                        }}
                    />
                </TouchableHighlight>



                { /* Filter overlay */ }
                { /* Only render when everything's ready to prevent multiple (expensive)
                     re-renderings whenever a filter is added */ }
                { this.props.componentStates.components.get('resistances') ===
                    componentStates.ready &&
                    <FilterOverlay
                        filterOverlayModel={this.props.filterOverlayModel}
                        filterValues={this.props.filterValues}
                        selectedFilters={this.props.selectedFilters}
                        componentStates={this.props.componentStates}
                    />
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    filterButtonContainer: {
        // borderWidth: 1,
        // borderColor: 'deepskyblue',
        // On Android, container serves as boundary  for button, has overflow:hidden. We must
        // therefore extend it on the right and bottom.
        height: 70,
        width: 70,
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    container: {
        flex: 1,
        // If we have a transparent background color, splash screen will appear below content on
        // android (only for regular builds, not if run in Expo though)
        backgroundColor: 'white',
    },
});
