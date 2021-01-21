import React from 'react';
import { computed } from 'mobx';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import Markdown, { hasParents } from 'react-native-markdown-renderer';
import { AllHtmlEntities } from 'html-entities';
// import ExternalLinkIcon from './icons/ExternalLinkIcon.js';
import MailIcon from './icons/MailIcon.js';

import styleDefinitions from '../../helpers/styleDefinitions.js';
import ShowResistancesForSelectedDiagnosisButton from './ShowResistancesForSelectedDiagnosisButton.js';

import openURL from '../../helpers/openURL.js';

/**
 * Renders the detail view of a diagnosis.
 * The diagnosis could be selected from the user to highlight the matrix view with
 * the recommended resistances
 *
 * @extends {React.Component}
 */
export default @observer class DiagnosisDetail extends React.Component {

    markdownRules = {
        text: (node, children, parent, styles) => <Text key={node.key}>{this.optimizeMarkdownContent(node.content)}</Text>,
        list_item: (node, children, parent, styles) => {
            if (hasParents(parent, 'bullet_list')) {
                return (
                    <View key={node.key} style={styles.listUnorderedItem}>
                        <Text style={styles.listUnorderedItemIcon}>{'\u2013'}</Text>
                        <View style={[styles.listItem]}>{children}</View>
                    </View>
                );
            }

            if (hasParents(parent, 'ordered_list')) {
                return (
                    <View key={node.key} style={styles.listOrderedItem}>
                        <Text style={styles.listOrderedItemIcon}>
                            {node.index + 1}{node.markup}
                        </Text>
                        <View style={[styles.listItem]}>{children}</View>
                    </View>
                );
            }

            return (
                <View key={node.key} style={[styles.listItem]}>
                    {children}
                </View>
            );
        },
    }

    optimizeMarkdownContent(markdownContent) {
        // 8201 => e28089

        return markdownContent
            // Abbreviations, e.g. x.y. (p.o. becomes p.(nnbsp)o.)
            .replace(/(\w\.)(\w\.)/g, `$1${AllHtmlEntities.decode('&#8239;')}$2`)
            // Number and unit (5g becomes 5(hairspace)g)
            .replace(/(\d+)([a-z]{1,2})(\b)/g, `$1${AllHtmlEntities.decode('&#8239;')}$2`)
            // Slashes (4g/kg/d becomes 4g(hairspace)/(hairspace)kg(hairspace)/(hairspace)d)
            // Only applies to slashes not followed or preceded by a space
            .replace(/(\S)\/(?!\s)/g, `$1${AllHtmlEntities.decode('&#8239;')}/${AllHtmlEntities.decode('&#8239;')}`);
    }

    @computed get selectedGuideline() {
        return this.props.guidelines.getById(this.props.route.params.selectedGuidelineID);
    }

    @computed get selectedDiagnosis() {
        return this.selectedGuideline.diagnoses
            .find(({ id }) => id === this.props.route.params.selectedDiagnosisID);
    }


    render() {

        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollViewContainer}
                >

                    <View style={styles.header}>
                        <Text style={styles.diagnosisClass}>
                            {this.selectedDiagnosis.diagnosisClass.name}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                openURL(this.selectedGuideline.link, this.props.notificationCenter);
                            }}
                        >
                            <Text style={styles.guidelineName}>
                                {this.selectedGuideline.name}
                            </Text>
                        </TouchableOpacity>

                        {this.selectedGuideline.markdownDisclaimer &&
                            <View style={styles.headerDisclaimer}>
                                <Markdown
                                    rules={this.markdownRules}
                                    style={styleDefinitions.markdownDisclaimer}
                                >
                                    {this.selectedGuideline.markdownDisclaimer}
                                </Markdown>
                            </View>
                        }
                    </View>

                    <View style={styles.content}>
                        <View style={styles.therapyList}>
                            {this.selectedDiagnosis.therapies.map(therapy =>
                                <View
                                    key={therapy.id}
                                    style={styles.therapyListItem}
                                >
                                    <View style={styles.therapyHeader}>
                                        <View style={styles.therapyHeaderOrderView}>
                                            <Text style={styles.therapyHeaderOrder}>
                                                {therapy.priority.order}
                                            </Text>
                                        </View>

                                        <View style={styles.therapyHeaderNameView}>
                                            <Text style={styles.therapyHeaderName}>
                                                {therapy.priority.name}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* {therapy.recommendedAntibiotics.map(antibiotic =>
                                        <View
                                            key={antibiotic.antibiotic.id}
                                        >
                                            <Text style={styles.antibioticName}>
                                                {antibiotic.antibiotic.name}
                                            </Text>
                                            {antibiotic.markdownText &&
                                            <Markdown rules={this.markdownRules} style={styleDefinitions.markdownStyles}>
                                                {antibiotic.markdownText}
                                            </Markdown>
                                            }
                                        </View>)
                                    } */}

                                    {therapy.markdownText &&
                                    <View style={styles.therapyMarkdown}>
                                        <Markdown rules={this.markdownRules} style={styleDefinitions.markdownStyles}>
                                            {therapy.markdownText}
                                        </Markdown>
                                    </View>
                                    }

                                </View>)}
                        </View>

                        {this.selectedDiagnosis.markdownText &&
                        <View>
                            <View style={styles.diagnosisMarkdownSeperator} />
                            <Text style={styles.diagnosisMarkdownTitle}>
                                General Considerations
                            </Text>
                            <Markdown rules={this.markdownRules} style={styleDefinitions.markdownStyles}>
                                {this.selectedDiagnosis.markdownText}
                            </Markdown>
                        </View>
                        }

                        <View style={styles.diagnosisMarkdownSeperator} />

                        <View style={styles.externalLinksContainer}>
                            {/* {diagnosis.link &&
                                <TouchableOpacity
                                    style={styles.externalLinkButton}
                                    onPress={() => {
                                        openURL(diagnosis.link, notificationCenter);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.externalLinkButtonText,
                                            styles.externalLinkButtonTextMargin]}
                                    >
                                        {selectedGuideline.name}
                                    </Text>
                                    <ExternalLinkIcon
                                        height={14}
                                        width={14}
                                    />
                                </TouchableOpacity>
                            } */}

                            {this.selectedGuideline.contactEmail &&
                                <TouchableOpacity
                                    style={styles.externalLinkButton}
                                    onPress={() => {
                                        openURL(
                                            `mailto:${this.selectedGuideline.contactEmail}`,
                                            this.props.notificationCenter,
                                        );
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.externalLinkButtonText,
                                            styles.externalLinkButtonTextMargin]}
                                    >
                                        Feedback
                                    </Text>
                                    <MailIcon
                                        height={14}
                                        width={14}
                                    />
                                </TouchableOpacity>
                            }
                        </View>

                        {this.selectedDiagnosis.latestUpdate &&
                        <View style={styles.dataSourceContainer}>
                            <Text style={styles.dataSourceText}>
                                Updated on {this.selectedDiagnosis.latestUpdate.date.getDate()}.{this.selectedDiagnosis.latestUpdate.date.getMonth() + 1}.{this.selectedDiagnosis.latestUpdate.date.getFullYear()} from
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    openURL(
                                        this.selectedDiagnosis.link,
                                        this.props.notificationCenter,
                                    );
                                }}
                            >
                                <Text style={[styles.dataSourceText, styles.dataSourceLink]}>
                                    {this.selectedDiagnosis.latestUpdate.name}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        }

                    </View>
                </ScrollView>
                <View style={styles.currentResistanceButtonContainer}>
                    <ShowResistancesForSelectedDiagnosisButton
                        selectedGuideline={this.selectedGuideline}
                        navigation={this.props.navigation}
                        diagnosis={this.selectedDiagnosis}
                    />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: styleDefinitions.colors.guidelines.middleBlue,
    },
    header: {
        backgroundColor: styleDefinitions.colors.guidelines.backgroundMiddleBlue,
        paddingLeft: 35,
        paddingRight: 27,
        paddingTop: 18,
        paddingBottom: 18,
    },
    scrollViewContainer: {},
    diagnosisMarkdownSeperator: {
        height: 1,
        backgroundColor: styleDefinitions.colors.guidelines.darkBlue,
        marginTop: 10,
        marginBottom: 10,
    },
    diagnosisMarkdownTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        paddingLeft: 20,
        paddingRight: 27,
        marginBottom: 110,
    },
    currentResistanceButtonContainer: {
        height: 50,
        width: 208,
        position: 'absolute',
        right: 16.7,
        bottom: 40,
    },
    diagnosisClass: {
        fontSize: 14,
        // marginTop: 18,
    },
    guidelineName: {
        fontSize: 14,
        fontWeight: 'bold',

        // marginBottom: 20,
    },
    headerDisclaimer: {
        color: styleDefinitions.colors.guidelines.gray,
        marginTop: 18,
    },
    antibioticName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    guidelineMarkdown: {
        marginBottom: 22,
    },
    therapyList: {
        marginTop: 22,
    },
    therapyListItem: {
        marginBottom: 30,
    },
    therapyHeader: {
        flex: 1,
        flexDirection: 'row',
        // marginBottom: 10,
    },
    therapyHeaderOrderView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,

        backgroundColor: styleDefinitions.colors.guidelines.darkBlue,
        borderRadius: 15,

        marginRight: 10,
    },
    therapyHeaderOrder: {
        fontSize: 16,
        color: '#FFF',
    },
    therapyHeaderNameView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
    },
    therapyHeaderName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: styleDefinitions.colors.guidelines.darkBlue,
    },
    therapyMarkdown: {
        paddingLeft: 40,
    },
    dataSourceContainer: {
        marginTop: 46,
    },
    dataSourceText: {
        color: styleDefinitions.colors.guidelines.infoTextGray,
        fontSize: 13,
    },
    dataSourceLink: {
        textDecorationLine: 'underline',
    },
    externalLinksContainer: {},
    externalLinkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 170,
        padding: 10,
        marginTop: 22,

        borderWidth: 1,
        borderColor: styleDefinitions.colors.guidelines.darkBlue,
        borderRadius: 5,

        justifyContent: 'space-between',
    },
    externalLinkButtonText: {
        color: styleDefinitions.colors.guidelines.darkBlue,
        fontSize: 14,
        fontWeight: 'bold',
    },
    externalLinkButtonTextMargin: {
        marginRight: 5,
    },
});
