import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { observer } from 'mobx-react';
import log from '../../helpers/log';
import styleDefinitions from '../../helpers/styleDefinitions';
import FilterOverlaySwitchItemCheckMark from './FilterOverlaySwitchItemCheckMark';

/**
 * A single switch item (checkbox plus text) for filter overlays
 */
@observer
export default class FilterOverlaySwitchItem extends React.Component {

    handleSwitchPress() {
        log('FilterOverlaySwitchItem: Item pressed.');
        this.props.selectionChangeHandler();
    }

    render() {

        log('FilterOverlaySwitchItem: Render');

        const borderTopWidth = this.props.borderTop ? 1 : 0;
        const circleSelectedStateStyle = this.props.selected ? styles.checkboxCircleSelected :
            styles.checkboxCircleNotSelected;

        return (
            <TouchableHighlight onPress={this.handleSwitchPress.bind(this)}>
                <View
                    style={[
                        styles.filterListItem, {
                            borderTopWidth,
                        },
                    ]}>
                    { /* Adjust checkbox vertically */ }
                    <View style={styles.checkboxCircleContainer}>
                        <View style={styles.container}>
                            <View
                                style={[
                                    styles.checkboxCircle,
                                    circleSelectedStateStyle,
                                ]}
                            >
                                <View style={styles.checkmark}>
                                    <FilterOverlaySwitchItemCheckMark
                                        height={16}
                                        width={16}
                                        strokeColor={styleDefinitions.colors.mediumBackgroundGrey}
                                        strokeWidth={2}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    { /* Adjust text vertically */ }
                    <View style={[styles.container]}>
                        <Text style={styles.label}>
                            {this.props.name}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // borderWidth: 1,
        // borderColor: 'skyblue',
    },
    filterListItem: {
        backgroundColor: styleDefinitions.colors.mediumBackgroundGrey,
        borderColor: styleDefinitions.colors.lightBackgroundGrey,
        borderBottomWidth: 1,
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%',
        flexDirection: 'row',
    },
    checkboxCircleContainer: {
        width: 30,
        height: '100%',
        // borderWidth: 1,
        // borderColor: 'pink',
    },
    checkboxCircle: {
        position: 'absolute',
        height: 24,
        width: 24,
        borderRadius: 12,
    },
    checkmark: {
        position: 'absolute',
        top: 5,
        left: 3,
        // borderColor: 'deeppink',
        // borderWidth: 1,
    },
    checkboxCircleSelected: {
        backgroundColor: styleDefinitions.colors.green,
    },
    checkboxCircleNotSelected: {
        borderColor: styleDefinitions.colors.green,
        borderWidth: 1,
    },
    label: {
        ...styleDefinitions.fonts.condensed,
        color: 'white',
        paddingLeft: 8,
        fontSize: 20,
    },
});
