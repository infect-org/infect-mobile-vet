import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import styleDefinitions from '../../helpers/styleDefinitions';

@observer
export default class AntibioticLabel extends React.Component {

    @observable labelDimensions = {
        height: 0,
        width: 0,
    }

    // Rotation of labels in degrees
    labelRotationDeg = -60;

    get rotationRad() {
        return this.labelRotationDeg * (Math.PI / 180);
    }

    @computed get transformation() {
        // We only know the transformation after defaultRadius is available; before just don't
        // position anything
        if (!this.props.matrix.defaultRadius) return [];
        const position = this.props.matrix.xPositions.get(this.props.antibiotic);
        const stylePosition = [{
            translateX: position.left,
        }, {
            translateY: this.props.matrix.antibioticLabelRowHeight,
        }];
        return stylePosition;
    }

    labelLayoutHandler = (ev) => {
        const { width, height } = ev.nativeEvent.layout;
        this.setDimensions(width, height);
    }

    @action setDimensions(width, height) {
        this.labelDimensions.width = width;
        this.labelDimensions.height = height;
        // Switch and recalculate width/height as we use a 60 deg angle
        const effectiveHeight = Math.abs((Math.sin(this.rotationRad) * width)) +
            Math.abs((Math.cos(this.rotationRad) * height));
        console.log('ABLabel: Height is', effectiveHeight);
        this.props.antibiotic.setDimensions(
            Math.ceil(height * 2),
            Math.ceil(effectiveHeight),
        );
    }

    @computed get labelRotatorStyle() {
        return {
            transform: [{
                rotate: `${this.labelRotationDeg}deg`,
            }],
        };
    }

    @computed get shortName() {
        return this.props.antibiotic.antibiotic.name
            .split('/')
            // If name has no /, limit length to 12 chars, else to 6
            .map((subName, index, total) => subName.substr(0, 12 / total.length))
            .join('/');
    }

    @computed get labelRotatorAdjustmentStyle() {
        const moveDown = ((this.labelDimensions.width / 2) * Math.sin(this.rotationRad)) -
            ((this.labelDimensions.height / 2) * Math.cos(this.rotationRad));
        const moveLeft = ((this.labelDimensions.width / 2) * Math.cos(this.rotationRad) * -1) -
            ((this.labelDimensions.height / 2) * Math.sin(this.rotationRad));
        // Transformation origin is center/center; adjust position to create a translation
        // originating at left/middle.
        return {
            transform: [{
                translateX: Math.round(moveLeft - (this.props.matrix.defaultRadius || 0)),
            }, {
                translateY: Math.round(moveDown),
            }],
        };
    }

    render() {
        return (
            // Basic placement of label: Just set x/y
            <View
                style={ [
                    styles.labelContainer,
                    {
                        transform: this.transformation,
                    },
                ] }>
                { /* When rotating, transformation origin is center/middle; this container moves
                     transformation so that center becomes left/middle. If we do this transformation
                     on the rotation container, we'll have to adjust everything by the rotation */ }
                <View
                    style={[
                        this.labelRotatorAdjustmentStyle,
                    ]}>
                    { /* Rotate label */ }
                    <View
                        style={ [
                            styles.labelRotator,
                            this.labelRotatorStyle,
                        ] }
                    >
                        <Text
                            style={ [
                                styles.labelText,
                            ] }
                            onLayout={ this.labelLayoutHandler }>
                            { this.shortName }
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    labelContainer: {
        position: 'absolute',
    },
    labelRotator: {
    },
    labelText: {
        ...styleDefinitions.base,
        ...styleDefinitions.label,
        textAlign: 'left',
    },
});
