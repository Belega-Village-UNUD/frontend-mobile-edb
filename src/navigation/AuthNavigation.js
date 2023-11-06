import { LoginScreen, SignupScreen, ResetPasswordScreen } from '../screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function AuthNavigation() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName='Login'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Signup' component={SignupScreen} />
            <Stack.Screen
                name='Reset Password'
                component={ResetPasswordScreen}
            />
        </Stack.Navigator>
    );
}
