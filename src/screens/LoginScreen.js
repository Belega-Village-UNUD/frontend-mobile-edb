import { View, Image, Text } from 'react-native';
import React from 'react';

export default function LoginScreen() {
    return (
        <View className='bg-white h-full w-full'>
            <Image
                className='h-full w-full absolute'
                source={require('../assets/Login/wave-background.png')}
            />
            <View className='h-full w-full flex justify-around'>
                <View className='flex items-center'>
                    <Text className='text-black font-bold text-[28px] tracking-wider'>
                        Login
                    </Text>
                </View>
            </View>
        </View>
    );
}
