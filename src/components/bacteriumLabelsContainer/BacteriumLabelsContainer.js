import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import Animated from 'react-native-reanimated';
import BacteriumLabel from '../bacteriumLabel/BacteriumLabel';

@observer
export default class BacteriumLabelsContainer extends React.Component {

    render() {
        return (
            <Animated.View
                style={[
                    {
                        transform: [{
                            translateY: this.props.animatedTop,
                        }, {
                            scale: this.props.animatedZoom,
                        }],
                    },
                    styles.container,
                    // { borderWidth: 1, borderColor: 'purple' },
                ]}
            >
                { this.props.matrix.sortedBacteria.map(bact => (
                    <BacteriumLabel
                        key={bact.bacterium.id}
                        containerHeight={this.props.containerHeight}
                        additionalLabelSpacingIncrease={this.props.additionalLabelSpacingIncrease}
                        maxZoom={this.props.maxZoom}
                        bacterium={bact}
                        matrix={this.props.matrix} />
                )) }
            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
