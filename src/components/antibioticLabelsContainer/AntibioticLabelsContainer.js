import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import Animated from 'react-native-reanimated';
import AntibioticLabel from '../antibioticLabel/AntibioticLabel';

const { sub, add, divide, multiply } = Animated;

@observer
export default class AntibioticLabelsContainer extends React.Component {

    render() {

        // We have to increase the height of the container so that in the maximum zoom out state it
        // still is able to display the whole labels
        const adjustedContainerHeight = (this.props.labelZoomRange.min / this.props.zoomRange[0]) *
            (this.props.containerHeight || 0);

        // As we increased the container's height, we now have to move the labels down and the
        // containerup by the additional height.
        const moveContainerUpBy = adjustedContainerHeight - this.props.containerHeight;

        // Move labels up a little bit when we zoom in (or they will go too low as transform
        // origin is center/center; if not, labels touch the container's bottom
        const scaleTopCorrection = multiply(
            sub(this.props.additionalLabelSpacingIncrease, 1),
            // Half the height of ab labels (as we're zooming from *center*)
            adjustedContainerHeight,
            0.5,
            // Account for current zoom level
            this.props.animatedZoom,
            // Move up, not down
            -1,
        );

        /* console.log(
            'AntibioticLabelsContainer: Height',
            this.props.containerHeight,
            this.props.zoomRange,
            this.props.labelZoomRange,
            adjustedContainerHeight,
            'move container up by',
            moveContainerUpBy,
        ); */

        return (
            <Animated.View
                style={[
                    {
                        transform: [{
                            translateX: this.props.animatedLeft,
                        }, {
                            translateY: scaleTopCorrection,
                        }, {
                            scale: this.props.animatedZoom,
                        }],
                        top: moveContainerUpBy * -1,
                    },
                    { borderWidth: 1, borderColor: 'purple' },
                    // Increase height as container is zooming out more than the labels it contains
                    // (because they're zoomed in when we're below labelZoomRange)
                    styles.container,
                    { height: adjustedContainerHeight },
                ]}
            >
                { this.props.matrix.sortedAntibiotics.map(ab => (
                    <AntibioticLabel
                        moveLabelDownBy={moveContainerUpBy}
                        antibiotic={ab}
                        maxZoom={this.props.labelZoomRange.max}
                        cappedLabelZoom={this.props.cappedLabelZoom}
                        animatedZoom={this.props.animatedZoom}
                        key={ab.antibiotic.id}
                        containerHeight={adjustedContainerHeight}
                        containerWidth={this.props.containerWidth}
                        matrix={this.props.matrix} />
                ))}
            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});
