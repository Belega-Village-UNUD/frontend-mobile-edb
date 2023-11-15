import {
    LoginScreen,
    SignupScreen,
    ResetPasswordScreen,
    ChangePasswordScreen,
    ForgotPasswordScreen,
    OtpScreen,
} from '../screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function AuthNavigation() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName='Signup'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Signup' component={SignupScreen} />
            <Stack.Screen
                name='Forgot Password'
                component={ForgotPasswordScreen}
            />
            <Stack.Screen
                name='Reset Password'
                component={ResetPasswordScreen}
            />
            <Stack.Screen
                name='Change Password'
                component={ChangePasswordScreen}
            />
            <Stack.Screen name='Otp' component={OtpScreen} />
        </Stack.Navigator>
    );
}
