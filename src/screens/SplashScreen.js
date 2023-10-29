import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';

export default function SplashScreen() {
    const navigation = useNavigation();
    useEffect(() => {
        setTimeout(() => {
            navigation.replace('Onboarding');
        }, 2000);
    });
    return (
        <View className='bg-[#53B175] flex-1 justify-center w-full h-full'>
            <View className='flex-row items-center justify-center mb-24'>
                <Image source={require('../assets/Splash/splash-logo.png')} />
            </View>
            <View className='flex-row items-center justify-center'>
                <Image source={require('../assets/Splash/BeCommerce.png')} />
            </View>
        </View>
    );
}
