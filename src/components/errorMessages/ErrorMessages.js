import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { observer } from 'mobx-react';
import styleDefinitions from '../../helpers/styleDefinitions';

@observer
export default class ErrorMessages extends React.Component {

    render() {
        return (
            <View style={ styles.errorContainer }>
                <View>
                    <Text style={ styles.errorTitle }>Error</Text>
                    { this.props.errors.map((err, index) => (
                        <Text
                            style={ styles.errorText }
                            key={ index }>
                            { err.message }
                        </Text>
                    )) }
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    errorContainer: {
        backgroundColor: styleDefinitions.colors.error,
        padding: 20,
    },
    errorText: {
        color: 'white',
    },
    errorTitle: {
        color: 'white',
        fontWeight: 'bold',
        paddingBottom: 10,
    },
});
