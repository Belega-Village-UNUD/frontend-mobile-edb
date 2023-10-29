import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export default function HomeScreen() {
    const navigation = useNavigation();
    return (
        <View className='flex-1 items-center justify-center'>
            <Text>Home Screen</Text>
            <TouchableOpacity
                className='bg-pink-100 mt-2 p-2 rounded'
                onPress={() => navigation.navigate('Profile')}
            >
                <Text>Go to Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className='flex bg-blue-100 justify-center items-center'
                onPress={() => navigation.navigate('Splash')}
            >
                <Text>Go to Splash</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className='flex bg-lime-100 justify-center items-center'
                onPress={() => navigation.navigate('Onboarding')}
            >
                <Text>Go to Onboarding</Text>
            </TouchableOpacity>
        </View>
    );
}
