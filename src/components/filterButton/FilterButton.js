import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { observer } from 'mobx-react';
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

    render() {

        // Remove button when overlay is visible as its elevation (on Android) pushes it *above*
        // the filterOverlay and it's therefore always visible
        if (this.props.filterOverlayModel.isVisible) return null;

        return (

            <TouchableWithoutFeedback
                onPress={this.handleFilterButtonPress}
            >
                <View style={styles.filterButton}>
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
});
