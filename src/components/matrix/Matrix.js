import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { DangerZone } from 'expo';
import PanPinch from 'react-native-pan-pinch';
import log from '../../helpers/log';
import MatrixContent from '../matrixContent/MatrixContent';

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
                        componentStates={this.props.componentStates}
                        handleContentLayout={this.handleContentLayout.bind(this)}
                        handleContainerLayout={this.handleContainerLayout.bind(this)}
                        // Only needed when we remove PanPinch from DOM
                        // animatedLeft={new Animated.Value(0)}
                        // animatedTop={new Animated.Value(0)}
                        // animatedZoom={new Animated.Value(1)}
                    />
                </PanPinch>

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
});
