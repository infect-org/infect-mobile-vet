import React from 'react';
import { View, StyleSheet } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { filterTypes } from 'infect-frontend-logic';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';
import log from '../../helpers/log';
import FilterList from './FilterList';

@observer
export default class BacteriaFilters extends React.Component {

    constructor(...props) {
        super(...props);
        this.toggleBacteria = this.toggleBacteria.bind(this);
    }

    @computed get shapes() {
        // Strangely, there's a shape in the DB that doesn't have a value (it's undefined) …
        return this.props.filterValues.getValuesForProperty(filterTypes.bacterium, 'shape')
            .filter(item => item.value !== undefined);
    }

    toggleBacteria() {
        this.props.changeDetailPanelContent(filterTypes.bacterium);
    }

    @computed get metabolisms() {
        const applications = [
            this.props.filterValues.getValuesForProperty(filterTypes.bacterium, 'aerobic')
                .find(item => item.value === true),
            this.props.filterValues.getValuesForProperty(filterTypes.bacterium, 'anaerobic')
                .find(item => item.value === true),
        ];
        log('BacteriaFilters: Metabolisms are', applications);
        return applications;

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
                    items={this.gramValues}
                    selectedFilters={this.props.selectedFilters}
                    property={filterTypes.bacterium}
                    name="gram"
                    filterValues={this.props.filterValues}
                />

                <FilterOverlayTitle
                    title="Shape"
                    level={2}
                />
                <FilterList
                    items={this.shapes}
                    selectedFilters={this.props.selectedFilters}
                />

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
