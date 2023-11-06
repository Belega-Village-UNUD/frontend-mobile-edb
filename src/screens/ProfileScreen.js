import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import styles from './styles/profile.style';
import { StatusBar } from 'expo-status-bar';
import {
    MaterialCommunityIcons,
    AntDesign,
    SimpleLineIcons,
} from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [userLogin, setUserLogin] = useState(true);

    const logout = () => {
        Alert.alert('Logout', 'Apakah anda yakin ingin keluar?', [
            {
                text: 'Batal',
                onPress: () => console.log('Batal ditekan'),
            },
            {
                text: 'Ya',
                onPress: () => {
                    setUserLogin(false);
                    console.log('Ya ditekan');
                },
            },
        ]);
    };

    const deleteAccount = () => {
        Alert.alert('Hapus Akun', 'Apakah anda yakin ingin menghapus akun?', [
            {
                text: 'Batal',
                onPress: () => console.log('Batal ditekan'),
            },
            {
                text: 'Hapus',
                onPress: () => {
                    setUserLogin(false);
                    console.log('Hapus ditekan');
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <StatusBar />
                <View style={{ width: '100%' }}>
                    <Image
                        source={require('../assets/images/wicker-baskets.jpg')}
                        style={styles.cover}
                    />
                </View>
                <View style={styles.profileContainer}>
                    <Image
                        source={require('../assets/images/userDefault.png')}
                        style={styles.profile}
                    />
                    <Text style={styles.name}>
                        {userLogin === true
                            ? 'Abel'
                            : 'Tolong login terlebih dahulu ke akun anda!'}
                    </Text>
                    {userLogin === false ? (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Auth')}
                        >
                            <View style={styles.loginBtn}>
                                <Text style={styles.menuText}>
                                    L O G I N {'    '}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity>
                            <View style={styles.loginBtn}>
                                <Text style={styles.menuText}>
                                    abeljollando@gmail.com {'   '}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    {userLogin === false ? (
                        <View></View>
                    ) : (
                        <View style={styles.menuWrapper}>
                            <TouchableOpacity onPress={() => {}}>
                                <View style={styles.menuItem(0.2)}>
                                    <MaterialCommunityIcons
                                        name='heart-outline'
                                        size={24}
                                        color={COLORS.primary}
                                    />
                                    <Text style={styles.menuText}>Favorit</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {}}>
                                <View style={styles.menuItem(0.2)}>
                                    <MaterialCommunityIcons
                                        name='truck-delivery-outline'
                                        size={24}
                                        color={COLORS.primary}
                                    />
                                    <Text style={styles.menuText}>Order</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Cart');
                                }}
                            >
                                <View style={styles.menuItem(0.2)}>
                                    <SimpleLineIcons
                                        name='bag'
                                        size={24}
                                        color={COLORS.primary}
                                    />
                                    <Text style={styles.menuText}>Cart</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteAccount()}>
                                <View style={styles.menuItem(0.2)}>
                                    <AntDesign
                                        name='deleteuser'
                                        size={24}
                                        color={COLORS.primary}
                                    />
                                    <Text style={styles.menuText}>
                                        Hapus Akun
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => logout()}>
                                <View style={styles.menuItem(0.2)}>
                                    <AntDesign
                                        name='logout'
                                        size={24}
                                        color={COLORS.primary}
                                    />
                                    <Text style={styles.menuText}>Keluar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
