import { createStackNavigator, createAppContainer } from 'react-navigation';

import AppStage from './AppStage.js';
import DiagnosisList from './src/components/guideline/DiagnosisList.js';
import DiagnosisDetail from './src/components/guideline/DiagnosisDetail.js';

/**
 * Create the main navigation stack, we only have the AppStage (with the matric)
 * for now
 */
const MainStack = createStackNavigator({
    Start: {
        screen: AppStage,
        navigationOptions: () => ({
            header: null,
        }),
    },
});

/**
 * Create the guideline navigation stack
 * - DiagnosisList
 * - DiagnosisDetail
 */
const GuidelineStack = createStackNavigator({
    GuidelineList: {
        screen: DiagnosisList,
    },
    DiagnosisDetail: {
        screen: DiagnosisDetail,
    },
});

/**
 * Create the root stack with the mainStack and guidelineStack in it
 */
const RootStack = createStackNavigator(
    {
        Main: {
            screen: MainStack,
        },
        Guideline: {
            screen: GuidelineStack,
        },
    },
    {
        // mode: 'modal',
        headerMode: 'none',
    },
);

const App = createAppContainer(RootStack);

export default App;
