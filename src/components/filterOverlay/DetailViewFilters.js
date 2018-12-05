import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterList from './FilterList';
import log from '../../helpers/log';

/**
 * Title and list of filters that can be displayed in detailView of filter (2nd level of
 * HorizontalPanels)
 */
@observer
export default class DetailViewFilters extends React.Component {
    render() {
        return (
            <View style={ styles.container }>

                <FilterOverlayTitle
                    title={this.props.title}
                />

                <FilterList
                    property={this.props.property}
                    name="name"
                    sortProperty="niceValue"
                    filterValues={this.props.filterValues}
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
});
