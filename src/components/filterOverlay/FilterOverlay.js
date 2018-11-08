import React from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
    ScrollView,
    Dimensions,
    Linking,
    Button,
} from 'react-native';
import { observer } from 'mobx-react';
import { reaction, computed } from 'mobx';
import { DangerZone } from 'expo';
import log from '../../helpers/log';
import styleDefinitions from '../../helpers/styleDefinitions';
import componentStates from '../../models/componentStates/componentStates';
import AntibioticFilters from './AntibioticFilters';
import BacteriaFilters from './BacteriaFilters';
import PopulationFilters from './PopulationFilters';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';

const { Animated } = DangerZone;
const padding = 20;
const maxScreenDimension = Math.max(
    Dimensions.get('window').width,
    Dimensions.get('window').height,
);

@observer
export default class FilterOverlay extends React.Component {

    top = new Animated.Value(maxScreenDimension);
    // Strangely, if we only use top to hide filterOverlay, it's visible at the very beginning
    // (while stuff is rendered for the first time)
    opacity = new Animated.Value(0);

    constructor(props) {
        super(props);
        props.componentStates.update('filters', componentStates.rendering);
        this.openDisclaimer = this.openDisclaimer.bind(this);
        this.closeOverlay = this.closeOverlay.bind(this);
        this.removeAllFilters = this.removeAllFilters.bind(this);
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
                if (isVisible) {
                    this.top.setValue(0);
                    this.opacity.setValue(1);
                } else {
                    this.top.setValue(maxScreenDimension);
                    this.opacity.setValue(0);
                }
            },
        );

        log('FilterOverlay: Mounted');
        setTimeout(() => {
            // When componentDidMount, it hasn't been drawn yet. Delay to prevent flackering of
            // screen
            // TODO: Remove & improve!
            this.props.componentStates.update('filters', componentStates.ready);
        }, 300);
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
        return this.props.selectedFilters.originalFilters.length > 1;
    }


    render() {

        log('FilterOverlay: Render');

        return (
            <Animated.View
                style={[
                    styles.filterOverlay,
                    {
                        top: this.top,
                        opacity: this.opacity,
                    },
                ]}>
                
                { /* Background (clickable) */ }
                <TouchableHighlight
                    onPress={this.closeOverlay}
                    style={styles.filterOverlayBackgroundContainer}
                >
                    <View style={styles.filterOverlayBackground} />
                </TouchableHighlight>
                
                { /* Content */ }
                <View style={styles.filterOverlayContainer}>
                    <View style={styles.container}>
                        <ScrollView>

                            { /* Remove all filters */ }
                            { this.showResetAllFiltersButton &&
                                <TouchableHighlight
                                    onPress={this.removeAllFilters}
                                >
                                    <View style={styles.removeFiltersButton}>
                                        <View style={styleDefinitions.buttons.textContainer}>
                                            <Text style={styleDefinitions.buttons.primaryText}>
                                                × Remove all filters
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            }


                            <AntibioticFilters
                                filterValues={this.props.filterValues}
                                selectedFilters={this.props.selectedFilters}
                            />

                            <BacteriaFilters
                                filterValues={this.props.filterValues}
                                selectedFilters={this.props.selectedFilters}
                            />

                            <PopulationFilters
                                filterValues={this.props.filterValues}
                                selectedFilters={this.props.selectedFilters}
                            />

                            <View style={{ height: 20 }} />

                            <FilterOverlayTitle
                                title="Information" />

                            <Text style={styles.infoText}>
                                Monthly, INFECT imports a subset of the latest 365 days of bacterial
                                resistance data from the Swiss Center for Antibiotic resistance.
                            </Text>
                            <Text style={styles.infoText}>
                                INFECT accepts no responsibility or liability with regard to any
                                problems incurred as a result of using this site or any linked external
                                sites.
                            </Text>
                            <Button
                                onPress={this.openDisclaimer}
                                color={styleDefinitions.colors.green}
                                title="More information"
                                style={styles.infoButton}
                            />

                            { /* Add margin to bottom of container (that's covered by «Apply filters
                                 button) */ }
                            <View style={styles.bottomMarginContainer} />

                        </ScrollView>
                    </View>

                    { /* Apply filters button */ }
                    <View style={styles.applyFiltersButtonContainer}>
                        <TouchableHighlight
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
                        </TouchableHighlight>
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
        ...styleDefinitions.buttons.primaryButton,
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
        left: 0,
        right: 0,
        // Is positioned at top: 100%, therefore use height instead of top/bottom props
        height: '100%',
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
    },
    infoText: {
        marginLeft: padding,
        marginRight: padding,
        color: styleDefinitions.colors.white,
        ...styleDefinitions.fonts.condensed,
    },
    infoButton: {
        ...styleDefinitions.fonts.bold,
    },
    container: {
        flex: 1,
    },
});
