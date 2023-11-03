import { Image } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
    useEffect(() => {
        setTimeout(() => {
            navigation.replace('Onboarding');
        }, 2000);
    });
    return (
        <SafeAreaView className='bg-[#53B175] flex-1 justify-center w-full h-full'>
            <SafeAreaView className='flex-row items-center justify-center mb-24'>
                <Image source={require('../assets/Splash/splash-logo.png')} />
            </SafeAreaView>
            <SafeAreaView className='flex-row items-center justify-center'>
                <Image source={require('../assets/Splash/BeCommerce.png')} />
            </SafeAreaView>
        </SafeAreaView>
    );
}
