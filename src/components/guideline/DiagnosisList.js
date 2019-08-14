import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { observer } from 'mobx-react';

import styleDefinitions from '../../helpers/styleDefinitions';
import GuidelineHeaderRight from './header/GuidelineHeaderRight.js';
import GuidelineHeaderLeftTitle from './header/GuidelineHeaderLeftTitle.js';
import DiagnosisListItem from './DiagnosisListItem.js';

/**
 * Renders a diagnosis/guideline list.
 * The user could select one and go to the detail view.
 *
 * @extends {React.Component}
 */
@observer
export default class DiagnosisList extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor: styleDefinitions.colors.guidelines.darkBlue,
        },
        title: null,
        headerLeft: <GuidelineHeaderLeftTitle title="Guidelines" />,
        headerRight: <GuidelineHeaderRight drawer={navigation.getParam('drawer')} />,
    });

    render() {

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.props.navigation.getParam('guidelines').selectedGuideline.diagnoses}
                    style={styles.guidelineList}
                    bounces={false}
                    ItemSeparatorComponent={ () => <View style={styles.listSeparator} /> }
                    ListFooterComponent={ () => <View style={styles.listFooter} /> }
                    keyExtractor={item => `diagnosis_${item.id}`}
                    renderItem={({ item, index }) => <DiagnosisListItem
                        diagnosis={item}
                        index={index}
                        navigation={this.props.navigation}
                        drawer={this.props.navigation.getParam('drawer')}
                        selectedGuideline={this.props.navigation.getParam('guidelines').selectedGuideline}
                    />
                    }>
                </FlatList>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: styleDefinitions.colors.guidelines.middleBlue,
    },
    guidelineList: {
        marginTop: 22,
    },
    listSeparator: {
        marginBottom: 22.5,
        marginTop: 22.5,

        borderColor: styleDefinitions.colors.guidelines.darkBlue,
        borderBottomWidth: 1,

        opacity: 0.2,
    },
    listFooter: {
        marginTop: 10,
        marginBottom: 10,
    },
});
