import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PanPinch from 'react-native-pan-pinch';
import log from '../../helpers/log';
import MatrixContent from '../matrixContent/MatrixContent';
import styleDefinitions from '../../helpers/styleDefinitions';

/**
 * Matrix with interaction handling (pinch/pan)
 */
@observer
export default class Matrix extends React.Component {

    state = {
        containerDimensions: [],
        contentDimensions: [],
    }

    /**
     * Handles layout changes on container; container is part of MatrixContent, therefore
     * is called from MatrixContent.
     */
    handleContainerLayout(layout) {
        const { width, height } = layout;
        log('Matrix: handleContainerLayout for', layout);
        this.setState({ containerDimensions: [width, height] });
    }

    /**
     * Handles layout changes on main content element (resistances, as they are the pannable
     * content block); needed to set boundaries on PanPinch
     */
    handleContentLayout(layout) {
        const { width, height } = layout;
        log('Matrix: handleContentLayout for', layout);
        this.setState({ contentDimensions: [width, height] });
    }

    render() {

        log('Matrix: Render');

        return (
            <View
                style={styles.container}
            >
                <PanPinch
                    containerDimensions={this.state.containerDimensions}
                    contentDimensions={this.state.contentDimensions}
                >
                    <MatrixContent
                        style={styles.container}
                        matrix={this.props.matrix}
                        selectedFilters={this.props.selectedFilters}
                        setRenderingDone={this.props.setRenderingDone}
                        handleContentLayout={this.handleContentLayout.bind(this)}
                        handleContainerLayout={this.handleContainerLayout.bind(this)}
                    />
                </PanPinch>

                { /* Filter button */ }
                <View style={styles.filterButton} />

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterButton: {
        borderRadius: 25,
        height: 50,
        width: 50,
        backgroundColor: styleDefinitions.colors.green,
        position: 'absolute',
        right: 20,
        bottom: 20,
        shadowColor: '#000',
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 5,
            height: 5,
        },
    },
});
