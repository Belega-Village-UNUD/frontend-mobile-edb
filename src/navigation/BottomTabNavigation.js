import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, SearchScreen, ProfileScreen } from '../screens';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const screenOptions = {
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    headerShown: false,
    tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 70,
    },
};

export default function BottomTabNavigation() {
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={24}
                                color={focused ? COLORS.primary : COLORS.gray3}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name='Search'
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons
                                name={'search-sharp'}
                                size={24}
                                color={focused ? COLORS.primary : COLORS.gray3}
                            ></Ionicons>
                        );
                    },
                }}
            />
            <Tab.Screen
                name='Profile'
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons
                                name={focused ? 'person' : 'person-outline'}
                                size={24}
                                color={focused ? COLORS.primary : COLORS.gray3}
                            ></Ionicons>
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
}
