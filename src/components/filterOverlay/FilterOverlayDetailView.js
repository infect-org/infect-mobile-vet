import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight, ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { filterTypes } from 'infect-frontend-logic';
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
        this.props.changeDetailPanelContent(false);
    }

    @computed get title() {
        switch (this.props.selectedDetail.filters) {
            case filterTypes.antibiotic: return 'Substances';
            case filterTypes.substanceClass: return 'Substance Classes';
            case filterTypes.bacterium: return 'Bacteria';
            default: return 'Unknown';
        }
    }

    render() {
        log('FilterOverlayDetailView: Render');
        return (
            <View style={ styles.container }>
                <TouchableHighlight onPress={this.goBack}>
                    <Text style={styles.backButton}>‹ Back</Text>
                </TouchableHighlight>
                <ScrollView>
                    { this.props.selectedDetail.filters &&
                        <DetailViewFilters
                            selectedFilters={this.props.selectedFilters}
                            filterValues={this.props.filterValues}
                            title={this.title}
                            property={this.props.selectedDetail.filters}
                        />
                    }
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
