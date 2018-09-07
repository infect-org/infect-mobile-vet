import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import Animated from 'react-native-reanimated';
import AntibioticLabel from '../antibioticLabel/AntibioticLabel';

const { sub, divide, multiply } = Animated;

@observer
export default class AntibioticLabelsContainer extends React.Component {

    scaleTopCorrection = 0;

    /**
     * When user is zooming in, move labels up a tiny little bit (by zoom level * half of label's
     * height). If we don't, labels touch their container's bottom.
     */
    setupAnimatedProps() {
        this.scaleTopCorrection = multiply(
            sub(this.props.animatedZoom, 1),
            divide(this.props.matrix.antibioticLabelRowHeight, 2),
            -1,
        );
    }

    render() {

        if (this.props.matrix.defaultRadius) this.setupAnimatedProps();

        return (
            <Animated.View
                style={[
                    {
                        transform: [{
                            translateX: this.props.animatedLeft,
                        }, {
                            translateY: this.scaleTopCorrection,
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
