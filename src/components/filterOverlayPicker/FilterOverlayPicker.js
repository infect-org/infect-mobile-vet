import React from 'react';
import { View, StyleSheet, Picker, Platform } from 'react-native';
import { observer } from 'mobx-react';
import styleDefinitions from '../../helpers/styleDefinitions';

@observer
export default class FilterOverlayPicker extends React.Component {

    constructor(...props) {
        super(...props);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
    }

    /**
     * Picker component returns a string (value); we want to call the selectionChangeHandler with
     * the model that was passed in. Get model from value and return it.
     * @return {Object} Original model
     */
    getModelFromValue(modelValue) {
        return this.props.items.find(({ value }) => value === modelValue);
    }

    /**
     * Delegate handling of selection change events to parent component, if a handler was passed.
     * Call it with the selected model that was passed in.
     * @param  {String} value
     */
    handleSelectionChange(value) {
        if (!this.props.selectionChangeHandler) return;
        if (
            this.props.selectionChangeHandler &&
            typeof this.props.selectionChangeHandler !== 'function'
        ) {
            throw new Error(`FilterOverlayPicker: Attribute selectionChangeHandler passed is not a function, but ${typeof this.props.selectionChangeHandler}`);
        }
        const model = this.getModelFromValue(value);
        console.log('FilterOverlayPicker: Selection changed to %o', model);
        this.props.selectionChangeHandler(model);
    }

    textColor = Platform.OS === 'ios' ? 'white' : 'black';

    render() {
        return (
            <View style={ styles.container }>
                <Picker
                    style={styles.picker}
                    selectedValue="js"
                    prompt="android?"
                    mode="dialog"
                    onValueChange={this.handleSelectionChange}
                >
                    <Picker.Item
                        label="Please chose …"
                        value={undefined}
                        color={this.textColor}
                    />
                    { this.props.items.map(item => (
                        <Picker.Item
                            color={this.textColor}
                            key={item.value}
                            label={item.niceValue}
                            value={item.value}
                        />
                    ))}
                </Picker>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    picker: {
        flex: 1,
        backgroundColor: styleDefinitions.colors.darkBackgroundGrey,
    },
});
