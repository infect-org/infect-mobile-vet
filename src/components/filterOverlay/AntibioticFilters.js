import React from 'react';
import { View, StyleSheet } from 'react-native';
import { computed, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { filterTypes } from 'infect-frontend-logic';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';
import FilterList from './FilterList';
// import FilterOverlayPicker from '../filterOverlayPicker/FilterOverlayPicker';
import log from '../../helpers/log';

@observer
export default class AntibioticFilters extends React.Component {

    @observable isSubstancesPickerVisible = false;

    constructor(...props) {
        super(...props);
        this.toggleSubstancesPicker = this.toggleSubstancesPicker.bind(this);
        this.toggleSubstanceClassesPicker = this.toggleSubstanceClassesPicker.bind(this);
    }

    componentDidMount() {
        log('AntibioticFilters: Mounted');
    }

    @computed get applications() {
        const applications = [
            this.props.filterValues.getValuesForProperty(filterTypes.antibiotic, 'po')
                .find(item => item.value === true),
            this.props.filterValues.getValuesForProperty(filterTypes.antibiotic, 'iv')
                .find(item => item.value === true),
        ];
        log('AntibioticFilters: Applications are', applications);
        return applications;
    }

    @action toggleSubstancesPicker() {
        this.props.changeDetailPanelContent(filterTypes.antibiotic);
    }

    @action toggleSubstanceClassesPicker() {
        this.props.changeDetailPanelContent(filterTypes.substanceClass);
    }

    render() {

        log('AntibioticFilters: Render');

        return (
            <View style={styles.container}>
                <FilterOverlayTitle title="Antibiotics"/>


                { /* Substances */ }
                <FilterOverlayTitle
                    title="Substances"
                    followsTitle={true}
                    level={2}
                />
                { /* Selected substances: Checkbox */ }
                <FilterList
                    property={filterTypes.antibiotic}
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
                        name="Select substances …"
                        borderTop={true}
                        hideCheckbox={true}
                        selectionChangeHandler={this.toggleSubstancesPicker}
                    />
                </View>


                { /* Substance Classes */ }
                <FilterOverlayTitle
                    title="Substance Classes"
                    level={2}
                />
                { /* Selected substance classes */ }
                <FilterList
                    property={filterTypes.substanceClass}
                    name="name"
                    sortProperty="niceValue"
                    filterValues={this.props.filterValues}
                    selectedFilters={this.props.selectedFilters}
                    limitToSelected={true}
                />
                { /* All substanceClasses: Toggle detail view */ }
                <View style={styles.detailViewSwitchItem}>
                    <FilterOverlaySwitchItem
                        item={{}}
                        selectedFilters={this.props.selectedFilters}
                        name="Select substance classes …"
                        borderTop={true}
                        hideCheckbox={true}
                        selectionChangeHandler={this.toggleSubstanceClassesPicker}
                    />
                </View>


                { /* Application */ }
                <FilterOverlayTitle
                    title="Application"
                    level={2}
                />
                <FilterList
                    items={this.applications}
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
