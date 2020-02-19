import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import styleDefinitions from '../../helpers/styleDefinitions';
import FilterIcon from './FilterIcon';
import log from '../../helpers/log';

@observer
export default class FilterButton extends React.Component {

    constructor(...props) {
        super(...props);
        this.handleFilterButtonPress = this.handleFilterButtonPress.bind(this);
    }

    handleFilterButtonPress() {
        // Hide activeResistance (as it might display details for a resistance that will be hidden)
        log('MainView: Show overlay');
        this.props.matrix.setActiveResistance();
        this.props.filterOverlayModel.show();
    }

    /**
     * If we have selectedFilters show the count indicator
     */
    @computed get selectedFilterCount() {
        const filters = this.props.selectedFilters.originalFilters;
        return filters.length;
    }

    render() {

        // Remove button when overlay is visible as its elevation (on Android) pushes it *above*
        // the filterOverlay and it's therefore always visible
        if (this.props.filterOverlayModel.isVisible) return null;

        return (

            <TouchableWithoutFeedback
                onPress={this.handleFilterButtonPress}
            >
                <View style={styles.filterButton}>

                    {this.selectedFilterCount > 0 &&
                        <View style={styles.selectedFilterCountView}>
                            <Text style={styles.selectedFilterCountText}>
                                {this.selectedFilterCount}
                            </Text>
                        </View>
                    }

                    <View style={styles.filterIcon}>
                        <FilterIcon
                            height={28}
                            width={28}
                            fillColor="black" />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    filterIcon: {
        position: 'absolute',
        left: 12,
        top: 15,
        // borderWidth: 1,
        // borderColor: 'navy',
    },
    filterButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: styleDefinitions.colors.tenantColor,
        ...styleDefinitions.shadows.primaryButton,
    },
    selectedFilterCountView: {
        position: 'absolute',
        right: 0,
        top: -8,

        justifyContent: 'center',
        alignItems: 'center',
        width: 18,
        height: 18,

        backgroundColor: styleDefinitions.colors.red,
        borderRadius: 9,
    },
    selectedFilterCountText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
});
