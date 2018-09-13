import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import Animated from 'react-native-reanimated';
import AntibioticLabel from '../antibioticLabel/AntibioticLabel';

const { sub, divide, multiply } = Animated;

@observer
export default class AntibioticLabelsContainer extends React.Component {

    render() {

        // Move labels up a little bit when we zoom in (or they will go too low as transform
        // origin is center/center; if not, labels touch the container's bottom
        const scaleTopCorrection = multiply(
            // amount that cappedLabelZoom exceeds 1 by
            sub(
                this.props.cappedLabelZoom,
                1,
            ),
            // Half the height of ab labels
            divide(this.props.matrix.antibioticLabelRowHeight || 0, 2),
            // Move up, not down
            -1,
        );

        // When we zoom in more than cappedLabelZoom, labels extend through
        // additionalLabelSpacingIncrease; we have to increase the container's width to account for
        // that. If we don't, labels won't be visible outside container (on Android)
        const widthAdjustedForZoom = multiply(
            this.props.containerWidth,
            this.props.additionalLabelSpacingIncrease,
        );

        // Container only zooms to cappedZoomFactor – afterwards it stops zooming, therefore stays
        // at its left position. We need to move it to the left and fake a continuous zoom.
        const leftAdjustedForZoom = multiply(
            sub(this.props.additionalLabelSpacingIncrease, 1),
            this.props.containerWidth,
            0.5, // as we only move left, we go out from center …
        );

        const finalXTranslation = sub(this.props.animatedLeft, leftAdjustedForZoom);

        return (
            <Animated.View
                style={[
                    {
                        width: widthAdjustedForZoom,
                        transform: [{
                            translateX: finalXTranslation,
                        }, {
                            translateY: scaleTopCorrection,
                        }, {
                            scale: this.props.cappedLabelZoom,
                        }],
                    },
                    { borderWidth: 1, borderColor: 'purple' },
                    styles.container,
                ]}
            >
                { this.props.matrix.sortedAntibiotics.map(ab => (
                    <AntibioticLabel
                        antibiotic={ab}
                        additionalLabelSpacingIncrease={this.props.additionalLabelSpacingIncrease}
                        maxZoom={this.props.maxZoom}
                        cappedLabelZoom={this.props.cappedLabelZoom}
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
