import { View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';

const OnboardingScreen = () => {
    const navigation = useNavigation();
    useEffect(() => {
        setTimeout(() => {
            navigation.replace('Bottom Navigation');
        }, 2000);
    });
    return (
        <View className='flex-1 justify-center bg-white w-full h-full'>
            <View className='flex items-center justify-center bottom-6'>
                <Text className='text-center text-3xl font-bold bottom-4'>
                    Dapatkan furnitur bambu terbaik dari Belega
                </Text>
            </View>
            <View className='flex-row items-center justify-center'>
                <Text className='text-center text-sm font-extralight bottom-7'>
                    Marketplace furnitur dengan harga paling kompetitif dari
                    Desa Belega
                </Text>
            </View>
            <View className='flex-row items-center justify-center top-10'>
                <Image source={require('../assets/Onboarding/logo.png')} />
            </View>
            <View className='flex-row top-28'>
                <Image
                    source={require('../assets/Onboarding/wave-onboarding.png')}
                />
            </View>
        </View>
    );
};

export default OnboardingScreen;
