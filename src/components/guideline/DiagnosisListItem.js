import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
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
        this.props.navigation.navigate('DiagnosisDetail', {
            diagnosis: this.props.diagnosis,
            drawer: this.props.drawer,
            selectedGuideline: this.props.selectedGuideline,
            notificationCenter: this.props.notificationCenter,
        });
    }

    render() {
        const { diagnosis } = this.props;

        return (
            <TouchableHighlight
                underlayColor={styleDefinitions.colors.guidelines.darkBlue}
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
            </TouchableHighlight>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 33,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 22.5,
        marginTop: 22.5,
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
