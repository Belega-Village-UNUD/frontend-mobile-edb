import { OnboardingScreen, WelcomeScreen, LoginScreen } from '../screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function AuthNavigation() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName='Welcome'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='Welcome' component={WelcomeScreen} />
            <Stack.Screen name='Onboarding' component={OnboardingScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
        </Stack.Navigator>
    );
}
