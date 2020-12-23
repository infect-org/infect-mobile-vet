import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import DetailViewFilters from './DetailViewFilters.js';
import styleDefinitions from '../../helpers/styleDefinitions.js';
import log from '../../helpers/log.js';

/**
 * Detail view for filterOverlay (2nd level) after user choses to add filters of a property with
 * a lot of items (substances, substanceClasses, bacteria).
 */
@observer
export default class FilterOverlayDetailView extends React.Component {

    constructor(...params) {
        super(...params);
        this.goBack = this.goBack.bind(this);
    }

    /**
     * Display filter overlay main screen (instead of detail)
     */
    goBack() {
        this.props.navigation.navigate('MatrixFilters', {
            screen: 'FilterOverview',
        });
    }

    render() {
        log('FilterOverlayDetailView: Render');
        return (
            <View style={ styles.container }>
                <ScrollView>
                    <DetailViewFilters
                        selectedFilters={this.props.selectedFilters}
                        filterValues={this.props.filterValues}
                        property={this.props.route.params.filterType}
                    />
                    { /* Make sure bottom-most entries are not covered by «Apply» button */ }
                    <View style={{ width: '100%', height: this.props.bottomButtonHeight }} />
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        color: styleDefinitions.colors.tenantColor,
        ...styleDefinitions.fonts.bold,
        fontSize: 20,
        padding: 12,
        paddingLeft: 20,
    },
});
