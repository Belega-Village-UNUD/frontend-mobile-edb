import { OnboardingScreen, OpeningScreen } from '../screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function SplashNavigation() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName='Opening'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='Opening' component={OpeningScreen} />
            <Stack.Screen name='Onboarding' component={OnboardingScreen} />
        </Stack.Navigator>
    );
}
