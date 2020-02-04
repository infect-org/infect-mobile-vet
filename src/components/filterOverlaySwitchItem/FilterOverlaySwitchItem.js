import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import log from '../../helpers/log.js';
import styleDefinitions from '../../helpers/styleDefinitions.js';
import FilterOverlaySwitchItemCheckMark from './FilterOverlaySwitchItemCheckMark.js';

/**
 * A single switch item (checkbox plus text) for filter overlays
 */
@observer
export default class FilterOverlaySwitchItem extends React.Component {

    constructor(...props) {
        super(...props);
        this.handleSwitchPress = this.handleSwitchPress.bind(this);
    }

    /**
     * Handle click on switchItem: Delegate handling to parent component if it passed a valid
     * selectionChangeHandler prop. Call it with the model that was passed in as prop.item.
     */
    handleSwitchPress() {
        log('FilterOverlaySwitchItem: Item pressed.');
        if (!this.props.selectionChangeHandler) return;
        if (
            this.props.selectionChangeHandler &&
            typeof this.props.selectionChangeHandler !== 'function'
        ) {
            throw new Error(`FilterOverlayPicker: Attribute selectionChangeHandler passed is not a function, but ${typeof this.props.selectionChangeHandler}`);
        }
        this.props.selectionChangeHandler(this.props.item);
    }

    /**
     * See if current item is selected; defines if checkbox is checked or not
     */
    @computed get selected() {
        // log('FilterOverlaySwitchItem: Is filter selected?', this.props.item);
        return this.props.selectedFilters.isSelected(this.props.item);
    }

    render() {

        log('FilterOverlaySwitchItem: Render');

        const circleSelectedStateStyle = this.selected ? styles.checkboxCircleSelected 
            : styles.checkboxCircleNotSelected;

        return (
            <TouchableHighlight onPress={this.handleSwitchPress}>
                <View
                    style={styles.filterListItem}>
                    { /* Adjust checkbox vertically */ }
                    { !this.props.hideCheckbox &&
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
                                            strokeColor={
                                                styleDefinitions.colors.mediumBackgroundGrey
                                            }
                                            strokeWidth={2}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    { /* Adjust text vertically */ }
                    <View style={[styles.container]}>
                        <Text style={styles.label}>
                            { this.props.name || this.props.item.niceValue }
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
        backgroundColor: styleDefinitions.colors.tenantColor,
    },
    checkboxCircleNotSelected: {
        borderColor: styleDefinitions.colors.tenantColor,
        borderWidth: 1,
    },
    label: {
        ...styleDefinitions.fonts.condensed,
        color: 'white',
        paddingLeft: 8,
        fontSize: 20,
    },
});
