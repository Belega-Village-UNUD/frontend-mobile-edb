import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export default function ProfileScreen() {
    const navigation = useNavigation();
    return (
        <View className='flex-1 items-center justify-center'>
            <Text>Profile Screen</Text>
            <TouchableOpacity
                className='bg-lime-100 mt-2 p-2 rounded'
                onPress={() => navigation.navigate('Home')}
            >
                <Text>Go to Home</Text>
            </TouchableOpacity>
        </View>
    );
}
