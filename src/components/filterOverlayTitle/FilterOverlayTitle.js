import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import styleDefinitions from '../../helpers/styleDefinitions';

@observer
export default class FilterOverlayTitle extends React.Component {

    render() {

        const titleStyle = this.props.level === 2 ? styles.level2 : styles.level1;
        // Level 2 title may directly follow a level 1 title. If it does, we have to remove
        // some paddingTop.
        const adjustedMarginTop = this.props.followsTitle ? -4 :
            StyleSheet.flatten(titleStyle).marginTop;

        return (
            <Text
                style={[
                    styles.base,
                    titleStyle,
                    {
                        marginTop: adjustedMarginTop,
                    },
                    this.props.textColor ? {
                        color: this.props.textColor,
                    } : {},
                ]}>
                { this.props.title }
            </Text>
        );
    }

}

const styles = StyleSheet.create({
    base: {
        ...styleDefinitions.fonts.bold,
        marginLeft: 20,
        marginRight: 20,
    },
    level1: {
        fontSize: 18,
        color: 'white',
        marginTop: 16,
        marginBottom: 4,
    },
    level2: {
        fontSize: 14,
        marginTop: 12,
        marginBottom: 4,
        color: styleDefinitions.colors.lightForegroundGrey,
    },
});
