import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { observer } from 'mobx-react';

import GuidelineArrowRightIcon from './icons/GuidelineArrowRightIcon.js';
import styleDefinitions from '../../helpers/styleDefinitions.js';

/**
 * Represents a ListItem from the DiagnosisListView
 *
 * @extends {React.Component}
 */
export default @observer class DiagnosisListItem extends React.Component {

    constructor(props) {
        super(props);

        this.selectGuideline = this.selectGuideline.bind(this);
    }

    /**
     * Go to the detail view of this diagnosis
     */
    selectGuideline() {
        this.props.navigation.navigate('Guideline', {
            screen: 'DiagnosisDetail',
            params: {
                selectedGuidelineID: this.props.selectedGuideline.id,
                selectedDiagnosisID: this.props.diagnosis.id,
                // Needed to display name in header
                selectedDiagnosisName: this.props.diagnosis.name,
            },
        });
    }

    render() {
        const { diagnosis } = this.props;

        return (
            <TouchableWithoutFeedback
                onPress={this.selectGuideline}
            >
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{diagnosis.name}</Text>
                        {/*
                            we can't display the element only if matchedSynonym is defined
                            because the FilterList can't handle it...may be a bug
                        */}
                        <Text style={[styles.synonym, {
                            height: this.props.matchedSynonym ? 'auto' : 0,
                            marginTop: this.props.matchedSynonym ? 5 : 0,
                        }]}>{this.props.matchedSynonym}</Text>
                    </View>

                    <View style={styles.arrowView}>
                        <GuidelineArrowRightIcon
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
    textContainer: {
        flex: 1,
    },
    name: {
        color: styleDefinitions.colors.black,
        fontSize: styleDefinitions.fontSizes.guidelines.bigText,
    },
    synonym: {
        color: styleDefinitions.colors.black,
        fontSize: styleDefinitions.fontSizes.guidelines.regularText,
    },
    arrowView: {
        position: 'absolute',
        right: 19,
    },
});
