import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { observer } from 'mobx-react';
import Matrix from '../matrix/Matrix';
import FilterOverlay from '../filterOverlay/FilterOverlay';
import styleDefinitions from '../../helpers/styleDefinitions';

@observer
export default class MainView extends React.Component {

    handleFilterButtonPress() {
        this.props.filterOverlay.show();
    }

    render() {
        return (
            <View style={styles.container}>
                <Matrix
                    style={styles.matrix}
                    matrix={this.props.matrix}
                    selectedFilters={this.props.selectedFilters}
                    setRenderingDone={this.props.setRenderingDone}
                />

                { /* Filter overlay button */ }
                <TouchableHighlight
                    onPress={this.handleFilterButtonPress.bind(this)}
                    style={styles.filterButtonContainer}
                >
                    <View style={styles.filterButton} />
                </TouchableHighlight>

                { /* Filter overlay */ }
                { this.props.filterOverlay.isVisible &&
                    <FilterOverlay
                        filterOverlay={this.props.filterOverlay}
                        filterValues={this.props.filterValues}
                        selectedFilters={this.props.selectedFilters}
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
    filterButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: styleDefinitions.colors.green,
        ...styleDefinitions.shadows.primaryButton,
    },
    container: {
        flex: 1,
        // If we have a transparent background color, splash screen will appear below content on
        // android (only for regular builds, not if run in Expo though)
        backgroundColor: 'white',
    },
});
