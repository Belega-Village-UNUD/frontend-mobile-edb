import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { CartScreen, OtpScreen, VerificationScreen } from './src/screens';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import SplashNavigation from './src/navigation/SplashNavigation';
import AuthNavigation from './src/navigation/AuthNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        regular: require('./src/assets/fonts/Poppins-Regular.ttf'),
        light: require('./src/assets/fonts/Poppins-Light.ttf'),
        bold: require('./src/assets/fonts/Poppins-Bold.ttf'),
        medium: require('./src/assets/fonts/Poppins-Medium.ttf'),
        extrabold: require('./src/assets/fonts/Poppins-ExtraBold.ttf'),
        semibold: require('./src/assets/fonts/Poppins-SemiBold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* <Stack.Screen name='Otp' component={OtpScreen} /> */}
                {/* <Stack.Screen
                    name='Verification'
                    component={VerificationScreen}
                /> */}
                <Stack.Screen name='Splash' component={SplashNavigation} />
                <Stack.Screen
                    name='Bottom Navigation'
                    component={BottomTabNavigation}
                />
                <Stack.Screen name='Cart' component={CartScreen} />
                <Stack.Screen name='Auth' component={AuthNavigation} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
