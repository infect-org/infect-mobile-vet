import React from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    ScrollView,
    Dimensions,
    Linking,
    Button,
} from 'react-native';
import { observer } from 'mobx-react';
import { reaction, computed, observable, action } from 'mobx';
import { DangerZone } from 'expo';
import log from '../../helpers/log';
import styleDefinitions from '../../helpers/styleDefinitions';
import componentStates from '../../models/componentStates/componentStates';
import AntibioticFilters from './AntibioticFilters';
import BacteriaFilters from './BacteriaFilters';
import PopulationFilters from './PopulationFilters';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import HorizontalPanel from '../horizontalPanels/HorizontalPanel';
import HorizontalPanels from '../horizontalPanels/HorizontalPanels';
import FilterOverlayDetailView from './FilterOverlayDetailView';

const { Animated, Easing } = DangerZone;
const padding = 20;
const maxScreenDimension = Math.max(
    Dimensions.get('window').width,
    Dimensions.get('window').height,
);

/**
 * View for the overlay that opens when filter button is tapped. Contains:
 * - filters for antibitotics, bacteria, population
 * - two HorizontalPanes for a two level deep navigation through filters (long lists are split
 *   into a second dimension)
 * - an about text and link
 * - a button to remove all filters and close the overlay
 */
@observer
export default class FilterOverlay extends React.Component {

    left = new Animated.Value(maxScreenDimension);
    // Strangely, if we only use left to hide filterOverlay, it's visible at the very beginning
    // (while stuff is rendered for the first time)
    opacity = new Animated.Value(0);

    // Index of panel that should be visible, see HorizontalPanels. Use object to not cause
    // re-render of FilterOverlay when it changes.
    @observable currentPanel = { index: 0 };

    // Content that should be displayed in FilterOverlayDetailView, either substance,
    // substanceClass or bacteria. Use Object to not cause re-render of FilterOverlay when it
    // changes
    @observable selectedDetail = { filters: undefined };

    constructor(props) {
        super(props);
        props.componentStates.update('filters', componentStates.rendering);
        this.openDisclaimer = this.openDisclaimer.bind(this);
        this.closeOverlay = this.closeOverlay.bind(this);
        this.removeAllFilters = this.removeAllFilters.bind(this);
        this.changeDetailPanelContent = this.changeDetailPanelContent.bind(this);
    }

    componentDidMount() {
        // Well, well, well …
        // If we remove filterOverlay from DOM conditionally, it needs to re-render every time it
        // is displayed – which is slow and reduces the perceived performance. Instead, we move
        // the the overlay out of the screen (by whatever is greater, width or height, in case the
        // user rotates the device) and move it into the screen whenever it becomes visible. As
        // we use Animated.Values, no re-render is done, ever.
        reaction(
            () => this.props.filterOverlayModel.isVisible,
            (isVisible) => {
                log('FilterOverlay: Visibility changed to', isVisible);
                const baseConfig = {
                    duration: 100,
                    easing: Easing.inOut(Easing.ease),
                };
                const leftConfig = {
                    ...baseConfig,
                    toValue: isVisible ? 0 : maxScreenDimension,
                };
                Animated.timing(this.left, leftConfig).start();
                const opacityConfig = {
                    ...baseConfig,
                    toValue: isVisible ? 1 : 0,
                };
                Animated.timing(this.opacity, opacityConfig).start();
            },
        );

        log('FilterOverlay: Mounted');
        /* setTimeout(() => {
            // When componentDidMount, it hasn't been drawn yet. Delay to prevent flackering of
            // screen
            // TODO: Remove & improve!
            this.props.componentStates.update('filters', componentStates.ready);
        }, 300); */
        this.props.componentStates.update('filters', componentStates.ready);
    }

    removeAllFilters() {
        this.props.selectedFilters.removeAllFilters();
    }

    openDisclaimer() {
        Linking.openURL('https://infect.info/#information');
    }

    closeOverlay() {
        this.props.filterOverlayModel.hide();
    }

    @computed get showResetAllFiltersButton() {
        return this.props.selectedFilters.originalFilters.length > 0;
    }

    @action changeDetailPanelContent(content) {
        if (!content) {
            this.currentPanel.index = 0;
            this.selectedDetail.filters = undefined;
        } else {
            this.currentPanel.index = 1;
            this.selectedDetail.filters = content;
        }
    }

    render() {

        log('FilterOverlay: Render');
        // trace();

        return (
            <Animated.View
                style={[
                    styles.filterOverlay,
                    {
                        left: this.left,
                        opacity: this.opacity,
                    },
                ]}>

                { /* Background (clickable) */ }
                <TouchableOpacity
                    onPress={this.closeOverlay}
                    style={styles.filterOverlayBackgroundContainer}
                >
                    <View style={styles.filterOverlayBackground} />
                </TouchableOpacity>

                { /* Container (Viewport) */ }
                <View
                    style={[
                        styles.filterOverlayContainer,
                        // Scrolling should happen within a single HorizontalPanel. HorizontalPanel
                        // therefore needs to have the height of the *Safe Area* container, we
                        // cannot use window height/width (as this is larger than the safe area).
                        { height: this.props.windowSize.height },
                    ]}
                >

                    <HorizontalPanels currentPanel={this.currentPanel}>

                        {/* Content: Will move (translateX) to show main or detail content */ }
                        <HorizontalPanel>

                            { /* Filter list (main filters) */ }
                            <View style={styles.filterOverlayMainContent}>
                                <ScrollView>

                                    { /* Remove all filters */ }
                                    { this.showResetAllFiltersButton &&
                                        <TouchableWithoutFeedback
                                            onPress={this.removeAllFilters}
                                        >
                                            <View style={styles.removeFiltersButton}>
                                                <View
                                                    style={styleDefinitions.buttons.textContainer}
                                                >
                                                    <Text
                                                        style={
                                                            styleDefinitions.buttons.secondaryText
                                                        }
                                                    >
                                                        × Remove all filters
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    }


                                    <AntibioticFilters
                                        filterValues={this.props.filterValues}
                                        selectedFilters={this.props.selectedFilters}
                                        changeDetailPanelContent={this.changeDetailPanelContent}
                                    />

                                    <BacteriaFilters
                                        filterValues={this.props.filterValues}
                                        selectedFilters={this.props.selectedFilters}
                                        changeDetailPanelContent={this.changeDetailPanelContent}
                                    />

                                    <PopulationFilters
                                        filterValues={this.props.filterValues}
                                        selectedFilters={this.props.selectedFilters}
                                    />

                                    <View style={{ height: 20 }} />

                                    <FilterOverlayTitle
                                        title="Information" />

                                    <Text style={styles.infoText}>
                                        Monthly, INFECT imports a subset of the latest 365 days of
                                        bacterial resistance data from the Swiss Center for
                                        Antibiotic resistance.
                                    </Text>
                                    <Text style={styles.infoText}>
                                        INFECT accepts no responsibility or liability with regard
                                        to any problems incurred as a result of using this site
                                        or any linked external sites.
                                    </Text>
                                    <View style={styles.infoButtonContainer}>
                                        <Button
                                            onPress={this.openDisclaimer}
                                            color={styleDefinitions.colors.green}
                                            title="More information"
                                            style={styles.infoButton}
                                        />
                                    </View>

                                    { /* Add margin to bottom of container (that's covered by
                                         «Apply filters» button) */ }
                                    <View style={styles.bottomMarginContainer} />

                                </ScrollView>
                            </View>
                        </HorizontalPanel>

                        <HorizontalPanel>
                            <FilterOverlayDetailView
                                changeDetailPanelContent={this.changeDetailPanelContent}
                                selectedFilters={this.props.selectedFilters}
                                filterValues={this.props.filterValues}
                                selectedDetail={this.selectedDetail}
                                bottomButtonHeight={80}
                            />
                        </HorizontalPanel>

                    </HorizontalPanels>

                    { /* Apply filters button */ }
                    <View style={styles.applyFiltersButtonContainer}>
                        <TouchableWithoutFeedback
                            onPress={this.closeOverlay}
                            style={styles.container}
                        >
                            <View style={styles.applyFiltersButton}>
                                <View style={styles.applyFiltersButtonTextContainer}>
                                    <Text style={styles.applyFiltersButtonText}>
                                        Apply filters
                                    </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                </View>

            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    applyFiltersButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        // borderColor: 'skyblue',
        // borderWidth: 1,
    },
    bottomMarginContainer: {
        height: 80,
        width: '100%',
    },
    removeFiltersButton: {
        margin: padding,
        ...styleDefinitions.buttons.secondaryButton,
        backgroundColor: styleDefinitions.colors.green,
    },
    applyFiltersButton: {
        position: 'absolute',
        left: padding,
        right: padding,
        top: 0,
        backgroundColor: styleDefinitions.colors.green,
        ...styleDefinitions.buttons.primaryButton,
        ...styleDefinitions.shadows.primaryButton,
    },
    applyFiltersButtonTextContainer: {
        ...styleDefinitions.buttons.textContainer,
    },
    applyFiltersButtonText: {
        ...styleDefinitions.buttons.primaryText,
    },
    filterOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        // Is initially positioned at left: 100% (to make it invisible, but already rendered),
        // therefore use width instead of left/right props
        width: '100%',
    },
    filterOverlayBackgroundContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    filterOverlayBackground: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    filterOverlayContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: '20%',
        backgroundColor: styleDefinitions.colors.darkBackgroundGrey,
        // Shadow:
        elevation: 4,
        shadowColor: '#000',
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        // Hide detail or main if opposite is visible
        // overflow: 'hidden',
    },
    filterOverlayMainContent: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        // borderWidth: 2,
        // borderColor: 'pink',
    },
    filterOverlayDetailContent: {
        width: '100%',
        height: 50,
        position: 'absolute',
        left: '100%',
        // top: 0,
        // backgroundColor: 'coral',
    },
    infoText: {
        marginLeft: padding,
        marginRight: padding,
        color: styleDefinitions.colors.white,
        ...styleDefinitions.fonts.condensed,
    },
    infoButtonContainer: {
        // Margins needed for android, button has a background; are not applied to button itself,
        // must therefore be part of a container
        marginLeft: padding,
        marginRight: padding,
        marginTop: 5,
    },
    infoButton: {
        ...styleDefinitions.fonts.bold,
    },
    container: {
        flex: 1,
    },
});
