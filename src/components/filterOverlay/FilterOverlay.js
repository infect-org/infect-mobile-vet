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
import { reaction } from 'mobx';
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
        this.props.componentStates.update('filters', componentStates.ready);
    }

    openDisclaimer() {
        Linking.openURL('https://infect.info/#information');
    }

    handleApplyButtonPress() {
        this.props.filterOverlayModel.hide();
    }


    render() {

        log('FilterOverlay: Render');

        return (
            <Animated.View
                style={[
                    styles.filterOverlayContainer,
                    {
                        top: this.top,
                        opacity: this.opacity,
                    },
                ]}>

                <View style={styles.container}>
                    <ScrollView>

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
                        onPress={this.handleApplyButtonPress.bind(this)}
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
    applyFiltersButton: {
        position: 'absolute',
        left: padding,
        right: padding,
        height: 50,
        top: 0,
        borderRadius: 5,
        backgroundColor: styleDefinitions.colors.green,
        ...styleDefinitions.shadows.primaryButton,
    },
    applyFiltersButtonTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyFiltersButtonText: {
        ...styleDefinitions.fonts.bold,
        fontSize: 25,
        textAlign: 'center',
    },
    filterOverlayContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: styleDefinitions.colors.darkBackgroundGrey,
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
    /* contentPadding: {
        paddingLeft: padding,
        paddingRight: padding,
    }, */
});
