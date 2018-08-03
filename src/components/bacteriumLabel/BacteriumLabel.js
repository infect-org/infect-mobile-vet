import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import styleDefinitions from '../../helpers/styleDefinitions';

@observer
export default class BacteriumLabel extends React.Component {

    labelLayoutHandler = (ev) => {
        const { width } = ev.nativeEvent.layout;
        this.props.bacterium.setWidth(width);
    };

    @computed get labelStyle() {
        const width = this.props.matrix.bacteriumLabelColumnWidth || 'auto';
        return { width };
    }

    @computed get transform() {
        if (!this.props.matrix.defaultRadius) return [];
        const { top } = this.props.matrix.yPositions.get(this.props.bacterium);
        return [{
            translateY: top,
        }];
    }

    @computed get shortName() {
        return this.props.bacterium.bacterium.name
            .split(' ')
            .map((subName, index) => (index === 0 ?
                subName.substr(0, 4) :
                `${subName.substr(0, 2)}.`
            ))
            .join(' ');
    }

    render() {
        return (
            <Text
                style={ [
                    styles.labelText,
                    this.labelStyle,
                    { transform: this.transform },
                ] }
                onLayout={ this.labelLayoutHandler }>
                { this.shortName }
            </Text>
        );
    }

}

const styles = StyleSheet.create({
    labelText: {
        ...styleDefinitions.base,
        ...styleDefinitions.label,
        position: 'absolute',
        textAlign: 'right',
    },
});
