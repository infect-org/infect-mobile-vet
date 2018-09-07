import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import Animated from 'react-native-reanimated';
import AntibioticLabel from '../antibioticLabel/AntibioticLabel';

@observer
export default class AntibioticLabelsContainer extends React.Component {

    render() {
        return (
            <Animated.View
                style={[
                    {
                        transform: [{
                            translateX: this.props.animatedLeft,
                        }, {
                            scale: this.props.animatedZoom,
                        }],
                    },
                    // { borderWidth: 1, borderColor: 'purple' },
                    styles.container,
                ]}
            >
                { this.props.matrix.sortedAntibiotics.map(ab => (
                    <AntibioticLabel
                        antibiotic={ab}
                        additionalLabelSpacingIncrease={this.props.additionalLabelSpacingIncrease}
                        maxZoom={this.props.maxZoom}
                        key={ab.antibiotic.id}
                        containerWidth={this.props.containerWidth}
                        matrix={this.props.matrix} />
                ))}
            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
