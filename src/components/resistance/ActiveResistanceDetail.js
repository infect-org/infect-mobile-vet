import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
// import { computed } from 'mobx';
import { DangerZone } from 'expo';
import ResistanceDetail from './ResistanceDetail';
import log from '../../helpers/log';

const { Animated } = DangerZone;

/**
 * Container that holds ResistanceDetail. Spans over the whole matrix and displays ResistanceDetail
 * when needed.
 */
@observer
export default class ActiveResistanceDetail extends React.Component {

    /**
     * Dont add/remove detail from dom, just hide it. Why? Because performance sucks (especially
     * on android) if we re-render the whole circle. IDK why.
     */
    /* @computed get opacity() {
        return this.props.matrix.activeResistance !== undefined ? 1 : 0;
    } */

    render() {

        log('ActiveResistanceDetail: Render');

        return (
            <View
                style={[
                    styles.container,
                ]}
                pointerEvents="none"
            >
                { this.props.matrix.activeResistance &&
                    <Animated.View
                        style={[
                            styles.resistanceDetailContainer,
                            {
                                width: this.props.width,
                                height: this.props.height,
                            },
                            this.props.resistanceTransformation,
                        ]}
                    >
                        <ResistanceDetail
                            matrix={this.props.matrix}
                        />
                    </Animated.View>
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        zIndex: 11,
        // backgroundColor: 'salmon',
    },
    resistanceDetailContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        // borderColor: 'purple',
        // borderWidth: 1,
    },
});
