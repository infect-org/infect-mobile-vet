import { createStackNavigator, createAppContainer } from 'react-navigation';

import AppStage from './AppStage.js';
import DiagnosisList from './src/components/guideline/DiagnosisList.js';
import DiagnosisDetail from './src/components/guideline/DiagnosisDetail.js';

/**
 * Create the main navigation stack, we only have the AppStage (with the matric)
 * for now
 */
const mainStack = createStackNavigator({
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
const guidelineStack = createStackNavigator({
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
const rootStack = createStackNavigator(
    {
        Main: {
            screen: mainStack,
        },
        Guideline: {
            screen: guidelineStack,
        },
    },
    {
        // mode: 'modal',
        headerMode: 'none',
    },
);

const App = createAppContainer(rootStack);

export default App;
