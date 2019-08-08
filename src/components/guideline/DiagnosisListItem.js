import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { observer } from 'mobx-react';

import GuidelineIconArrowRight from './icons/GuidelineIconArrowRight.js';
import styleDefinitions from '../../helpers/styleDefinitions.js';

/**
 * Represents a ListItem from the DiagnosisListView
 *
 * @extends {React.Component}
 */
@observer
export default class DiagnosisListItem extends React.Component {

    constructor(props) {
        super(props);

        this.selectGuideline = this.selectGuideline.bind(this);
    }

    /**
     * Go to the detail view of this diagnosis
     */
    selectGuideline() {
        this.props.navigation.navigate('DiagnosisDetail', {
            diagnosis: this.props.diagnosis,
            drawer: this.props.drawer,
            selectedGuideline: this.props.selectedGuideline,
        });
    }

    render() {
        const { diagnosis } = this.props;

        return (
            <TouchableWithoutFeedback
                onPress={this.selectGuideline}
            >
                <View style={styles.container}>
                    <Text style={styles.name}>{diagnosis.name}</Text>
                    <View style={styles.arrowView}>
                        <GuidelineIconArrowRight
                            width={7.7}
                            height={15.5}
                            stroke={styleDefinitions.colors.guidelines.darkBlue}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        paddingLeft: 33,

        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        color: '#000',
        fontSize: 20,
    },
    arrowView: {
        position: 'absolute',
        right: 19,
    },
});
