import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InfectApp from '@infect/frontend-logic';

import log from './src/helpers/log.js';
import getURL from './src/config/getURL.js';
import AppStage from './AppStage.js';
import DiagnosisList from './src/components/guideline/DiagnosisList.js';
import DiagnosisDetail from './src/components/guideline/DiagnosisDetail.js';
import GuidelineCloseButton from './src/components/guideline/header/GuidelineCloseButton.js';
import GuidelineHeaderLeftBack from './src/components/guideline/header/GuidelineHeaderLeftBack.js';
import guidelineHeaderDefaultStyle from './src/components/guideline/header/guidelineHeaderDefaultStyle.js';

const RootStack = createStackNavigator();
const GuidelineStack = createStackNavigator();




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



function GuidelineStackScreen() {
    return (
        <GuidelineStack.Navigator>
            <GuidelineStack.Screen
                name="GuidelineList"
                options={({ navigation }) => ({
                    ...guidelineHeaderDefaultStyle,
                    headerRight: () => <GuidelineCloseButton navigation={navigation} />,
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
                    ...guidelineHeaderDefaultStyle,
                    headerTitle: route.params.selectedDiagnosisName,
                    headerRight: props => (<GuidelineCloseButton navigation={navigation} />),
                    headerLeft: props => <GuidelineHeaderLeftBack navigation={navigation} />,
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



export default function App() {
    return (
        <NavigationContainer>
            <RootStack.Navigator
                initialRouteName="Main"
                headerMode="none"
                screenOptions={{ gestureEnabled: false }}
            >
                <RootStack.Screen name="Main">
                    {params => <AppStage app={app} navigation={params.navigation}/>}
                </RootStack.Screen>
                <RootStack.Screen
                    name="Guideline"
                    component={GuidelineStackScreen}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

