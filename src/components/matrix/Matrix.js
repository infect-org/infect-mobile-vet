import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { DangerZone } from 'expo';
import PanPinch from 'react-native-pan-pinch';
import log from '../../helpers/log';
import MatrixContent from '../matrixContent/MatrixContent';
import styleDefinitions from '../../helpers/styleDefinitions';

const { Animated } = DangerZone;
const { Value } = Animated;


/**
 * Matrix with interaction handling (pinch/pan)
 */
@observer
export default class Matrix extends React.Component {

    containerDimensions = [new Value(100), new Value(100)];
    contentDimensions = [new Value(10), new Value(10)];
    zoomRange = [0.35, 2];

    /**
     * Handles layout changes on container; container is part of MatrixContent, therefore
     * is called from MatrixContent.
     */
    handleContainerLayout(layout) {
        const { width, height } = layout;
        log('Matrix: handleContainerLayout for', layout);
        this.containerDimensions[0].setValue(width);
        this.containerDimensions[1].setValue(height);
    }

    /**
     * Handles layout changes on main content element (resistances, as they are the pannable
     * content block); needed to set boundaries on PanPinch
     */
    handleContentLayout(layout) {
        const { width, height } = layout;
        log('Matrix: handleContentLayout for', layout);
        this.contentDimensions[0].setValue(width);
        this.contentDimensions[1].setValue(height);
    }

    render() {

        log('Matrix: Render');

        return (
            <View
                style={styles.container}
            >
                <PanPinch
                    containerDimensions={this.containerDimensions}
                    contentDimensions={this.contentDimensions}
                    zoomRange={this.zoomRange}
                >
                    <MatrixContent
                        style={styles.container}
                        matrix={this.props.matrix}
                        zoomRange={this.zoomRange}
                        selectedFilters={this.props.selectedFilters}
                        setRenderingDone={this.props.setRenderingDone}
                        handleContentLayout={this.handleContentLayout.bind(this)}
                        handleContainerLayout={this.handleContainerLayout.bind(this)}
                        // Only needed when we remove PanPinch from DOM
                        // animatedLeft={new Animated.Value(0)}
                        // animatedTop={new Animated.Value(0)}
                        // animatedZoom={new Animated.Value(1)}
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
        // borderColor: 'yellow',
        // borderWidth: 10,
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
