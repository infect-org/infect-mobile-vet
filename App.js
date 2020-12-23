import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InfectApp from '@infect/frontend-logic';

import log from './src/helpers/log.js';
import getURL from './src/config/getURL.js';
import AppStage from './AppStage.js';
import DiagnosisList from './src/components/guideline/DiagnosisList.js';
import DiagnosisDetail from './src/components/guideline/DiagnosisDetail.js';
import OverlayCloseButton from './src/components/overlay/OverlayCloseButton.js';
import OverlayHeaderLeftBack from './src/components/overlay/OverlayHeaderLeftBack.js';
import overlayDefaultStyle from './src/components/overlay/overlayDefaultStyle.js';
import filterOverlayDefaultStyle from './src/components/filterOverlay/filterOverlayDefaultStyle.js';
import guidelineHeaderDefaultStyle from './src/components/guideline/header/guidelineHeaderDefaultStyle.js';
import FilterOverlay from './src/components/filterOverlay/FilterOverlay.js';
import ComponentStatesModel from './src/models/componentStatesModel/ComponentStatesModel.js';
import FilterOverlayDetailView from './src/components/filterOverlay/FilterOverlayDetailView.js';

const RootStack = createStackNavigator();
const GuidelineStack = createStackNavigator();
const MatrixFilterStack = createStackNavigator();




// Main app (logic shared with the web)
const app = new InfectApp({ getURL });
app.initialize()
    .then(() => {
        log('App: Initialized');
    })
    .catch((err) => {
        app.notificationCenter.handle(err);
        log('Error initializing app', err);
    });


const componentStates = new ComponentStatesModel();
componentStates.setup();



function GuidelineStackScreen() {
    return (
        <GuidelineStack.Navigator>
            <GuidelineStack.Screen
                name="GuidelineList"
                options={({ navigation }) => ({
                    ...overlayDefaultStyle,
                    ...guidelineHeaderDefaultStyle,
                    headerRight: () => <OverlayCloseButton navigation={navigation} />,
                    headerTitle: 'SSI Guidelines',
                    headerLeft: () => {},
                })}
            >
                {props => <DiagnosisList
                    guidelines={app.guidelines}
                    navigation={props.navigation}
                />}
            </GuidelineStack.Screen>
            <GuidelineStack.Screen
                name="DiagnosisDetail"
                options={({ route, navigation }) => ({
                    ...overlayDefaultStyle,
                    ...guidelineHeaderDefaultStyle,
                    headerTitle: route.params.selectedDiagnosisName,
                    headerRight: props => <OverlayCloseButton navigation={navigation} />,
                    headerLeft: props => (<OverlayHeaderLeftBack
                        navigation={navigation}
                        stack="Guideline"
                        screen="GuidelineList"
                    />),
                })}
            >
                {props => <DiagnosisDetail
                    guidelines={app.guidelines}
                    notificationCenter={app.notificationCenter}
                    navigation={props.navigation}
                    route={props.route}
                />}
            </GuidelineStack.Screen>
        </GuidelineStack.Navigator>
    );
}



function MatrixFilterStackScreen() {
    return (
        <MatrixFilterStack.Navigator>
            <MatrixFilterStack.Screen
                name="FilterOverview"
                options={({ navigation }) => ({
                    ...overlayDefaultStyle,
                    ...filterOverlayDefaultStyle,
                    headerRight: () => <OverlayCloseButton navigation={navigation} />,
                    headerTitle: 'Filters',
                    headerLeft: () => {},
                })}
            >
                {props => <FilterOverlay
                    app={app}
                    navigation={props.navigation}
                    // componentStates={componentStates}
                    selectedFilters={app.selectedFilters}
                    filterValues={app.filterValues}
                    guidelines={app.guidelines}
                    guidelineRelatedFilters={app.guidelineRelatedFilters}
                />}
            </MatrixFilterStack.Screen>
            <MatrixFilterStack.Screen
                name="FilterDetail"
                options={({ navigation, route }) => ({
                    ...overlayDefaultStyle,
                    ...filterOverlayDefaultStyle,
                    headerTitle: route.params.content,
                    headerRight: props => <OverlayCloseButton navigation={navigation} />,
                    headerLeft: props => (<OverlayHeaderLeftBack
                        navigation={navigation}
                        stack="MatrixFilters"
                        screen="FilterOverview"
                    />),

                })}
            >
                {props => <FilterOverlayDetailView
                    filterValues={app.filterValues}
                    navigation={props.navigation}
                    selectedFilters={app.selectedFilters}
                    route={props.route}
                />}
            </MatrixFilterStack.Screen>
        </MatrixFilterStack.Navigator>
    );
}



export default function App() {
    return (
        <NavigationContainer>
            <RootStack.Navigator
                initialRouteName="Main"
                headerMode="none"
                screenOptions={{ gestureEnabled: false }}
            >
                <RootStack.Screen name="Main">
                    {props => <AppStage
                        app={app}
                        navigation={props.navigation}
                        componentStates={componentStates}/>
                    }
                </RootStack.Screen>
                <RootStack.Screen
                    name="Guideline"
                    component={GuidelineStackScreen}
                />
                <RootStack.Screen
                    name="MatrixFilters"
                    component={MatrixFilterStackScreen}
                />

            </RootStack.Navigator>
        </NavigationContainer>
    );
}

