import React from 'react';
import { View, StyleSheet } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { filterTypes } from '@infect/frontend-logic';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';
import log from '../../helpers/log';
import FilterList from './FilterList';

/**
 * View for all bacteria related filters (names, gram, shape, metabolism) in the filter overlay.
 */
@observer
export default class BacteriaFilters extends React.Component {

    constructor(...props) {
        super(...props);
        this.toggleBacteria = this.toggleBacteria.bind(this);
    }

    toggleBacteria() {
        this.props.changeDetailPanelContent(filterTypes.bacterium);
    }

    /**
     * Returns metabolisms. As they are not stored as a property of a bacterium in the database
     * (but rather as two separate properties 'aerobic' and 'anaerobic' which both might be true
     * or false), we have to simplify things and merge those two properties into one single list.
     * @return {Array} List of metabolisms, 'aerobic' and 'anaerobic'
     */
    @computed get metabolisms() {
        // First: Get both metabolisms (aerobic and anaerobic). Each of those contains values for
        // false and true.
        // After: Only take the true values (aerobic: true and anaerobic: true).
        // After: Return those two values for metabolisms.
        const metabolisms = [
            this.props.filterValues.getValuesForProperty(filterTypes.bacterium, 'aerobic')
                .find(item => item.value === true),
            this.props.filterValues.getValuesForProperty(filterTypes.bacterium, 'anaerobic')
                .find(item => item.value === true),
        ];
        log('BacteriaFilters: Metabolisms are', metabolisms);
        return metabolisms;
    }


    render() {

        log('BacteriaFilters: Render');

        return (
            <View style={styles.container}>
                <FilterOverlayTitle title="Bacteria"/>

                { /* Bacteria */ }
                <FilterOverlayTitle
                    title="Name"
                    followsTitle={true}
                    level={2}
                />
                { /* Selected bacteria: Checkbox */ }
                <FilterList
                    property={filterTypes.bacterium}
                    name="name"
                    sortProperty="niceValue"
                    filterValues={this.props.filterValues}
                    selectedFilters={this.props.selectedFilters}
                    limitToSelected={true}
                />
                { /* All substances: Toggle detail view */ }
                <View style={styles.detailViewSwitchItem}>
                    <FilterOverlaySwitchItem
                        item={{}}
                        selectedFilters={this.props.selectedFilters}
                        name="Select bacteria …"
                        borderTop={true}
                        hideCheckbox={true}
                        selectionChangeHandler={this.toggleBacteria}
                    />
                </View>

                { /* Gram */ }
                <FilterOverlayTitle
                    title="Gram"
                    level={2}
                />
                <FilterList
                    selectedFilters={this.props.selectedFilters}
                    property={filterTypes.bacterium}
                    name="gram"
                    filterValues={this.props.filterValues}
                />

                { /* Shape */ }
                <FilterOverlayTitle
                    title="Shape"
                    level={2}
                />
                <FilterList
                    selectedFilters={this.props.selectedFilters}
                    property={filterTypes.bacterium}
                    name="shape"
                    filterValues={this.props.filterValues}
                />

                { /* Metabolism */ }
                <FilterOverlayTitle
                    title="Metabolism"
                    level={2}
                />
                <FilterList
                    items={this.metabolisms}
                    selectedFilters={this.props.selectedFilters}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Items that switch detail view have a borderTop; if items are selected, they are displayed
    // right above and have a border bottom; to prevent a double-border (2px), we move the detail
    // view item up by -1px: It's not noticeable with or without filters selected.
    detailViewSwitchItem: {
        top: -1,
    },
});
