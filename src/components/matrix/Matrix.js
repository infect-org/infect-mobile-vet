import React from 'react';
import { StyleSheet, View } from 'react-native';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import PanPinch from 'react-native-pan-pinch';
import log from '../../helpers/log';
import MatrixContent from '../matrixContent/MatrixContent';

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
    handleContainerLayout(ev) {
        const { width, height } = ev.nativeEvent.layout;
        log('Matrix: handleContainerLayout for', width, height);
        this.setState({ containerDimensions: [width, height] });
    }

    /**
     * Handles layout changes on main content element (resistances, as they are the pannable
     * content block); needed to set boundaries on PanPinch
     */
    handleContentLayout(ev) {
        const { width, height } = ev.nativeEvent.layout;
        log('Matrix: handleContentLayout for', width, height);
        this.setState({ contentDimensions: [width, height] });
    }

    render() {

        log('Matrix: Render');

        return (
            <View
                style={styles.container}
                onLayout={ev => this.handleContainerLayout(ev)}
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
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
