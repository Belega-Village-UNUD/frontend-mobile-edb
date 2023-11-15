import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import styles from './styles/profile.style';
import { StatusBar } from 'expo-status-bar';
import {
    MaterialCommunityIcons,
    AntDesign,
    SimpleLineIcons,
    Ionicons,
} from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [userLogin, setUserLogin] = useState(false);

    const handleCheckUserLogin = async () => {
        try {
            const endpoint =
                'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/profiles';
            let token = await AsyncStorage.getItem('token');
            // console.log('token', token);
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { email, is_verified } = response.data.data.user;
            if (response.data.status === 200) {
                setUserData({ email, is_verified });
                setUserLogin(true);
            } else {
                setUserLogin(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleOptionClick = (option) => {
        if (
            !userData.is_verified &&
            option !== 'logout' &&
            option !== 'resendOtp'
        ) {
            Alert.alert(
                'Verifikasi Akun',
                'Akun anda belum terverifikasi, silahkan verifikasi akun anda terlebih dahulu.'
            );
        } else {
            switch (option) {
                case 'favorite':
                    navigation.navigate('Favorite');
                    break;
                case 'order':
                    navigation.navigate('Order');
                    break;
                case 'cart':
                    navigation.navigate('Cart');
                    break;
                case 'changePassword':
                    navigation.navigate('Auth', { screen: 'Change Password' });
                    break;
                case 'logout':
                    handleLogout();
                    break;
                case 'resendOtp':
                    handleResendAndNavigate();
                    break;
                default:
                    break;
            }
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Apakah anda yakin ingin keluar?', [
            {
                text: 'Batal',
                onPress: () => {},
            },
            {
                text: 'Ya',
                onPress: async () => {
                    await AsyncStorage.removeItem('token');
                    setUserLogin(false);
                },
            },
        ]);
    };

    const handleResendAndNavigate = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const endpoint =
                'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/otp';
            const data = {
                token: token,
            };
            // console.log(token);
            const response = await axios.post(endpoint, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.status === 200) {
                Alert.alert(
                    'OTP Terkirim Ulang',
                    'OTP telah dikirim ulang ke email anda',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                navigation.navigate('Auth', { screen: 'Otp' });
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('OTP Resent Failed', response.data.message);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            handleCheckUserLogin();
        }, [])
    );

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
                            ? ''
                            : 'Tolong login terlebih dahulu ke akun anda!'}
                    </Text>
                    {userLogin === false ? (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('Auth', { screen: 'Login' })
                            }
                        >
                            <View style={styles.loginBtn}>
                                <Text style={styles.menuText}>
                                    M A S U K {'    '}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.loginBtn}>
                            <Text style={styles.menuText}>
                                {userData.is_verified
                                    ? userData.email
                                    : 'U N V E R I F I E D'}
                                {'        '}
                            </Text>
                        </View>
                    )}
                    <ScrollView
                        style={{ flex: 1, marginBottom: 85 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {userLogin === false ? (
                            <View></View>
                        ) : (
                            <View style={styles.menuWrapper}>
                                {!userData.is_verified && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleOptionClick('resendOtp')
                                        }
                                    >
                                        <View style={styles.menuItem(0.2)}>
                                            <AntDesign
                                                name='reload1'
                                                size={24}
                                                color={COLORS.primary}
                                            />
                                            <Text style={styles.menuText}>
                                                Resend OTP
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() =>
                                        handleOptionClick('favorite')
                                    }
                                >
                                    <View style={styles.menuItem(0.2)}>
                                        <MaterialCommunityIcons
                                            name='heart-outline'
                                            size={24}
                                            color={COLORS.primary}
                                        />
                                        <Text style={styles.menuText}>
                                            Favorit
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleOptionClick('order')}
                                >
                                    <View style={styles.menuItem(0.2)}>
                                        <MaterialCommunityIcons
                                            name='truck-delivery-outline'
                                            size={24}
                                            color={COLORS.primary}
                                        />
                                        <Text style={styles.menuText}>
                                            Order
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleOptionClick('cart')}
                                >
                                    <View style={styles.menuItem(0.2)}>
                                        <SimpleLineIcons
                                            name='bag'
                                            size={24}
                                            color={COLORS.primary}
                                        />
                                        <Text style={styles.menuText}>
                                            Cart
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleOptionClick('changePassword');
                                    }}
                                >
                                    <View style={styles.menuItem(0.2)}>
                                        <Ionicons
                                            name='lock-closed-outline'
                                            size={24}
                                            color={COLORS.primary}
                                        />
                                        <Text style={styles.menuText}>
                                            Ubah Password
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleOptionClick('logout')}
                                >
                                    <View style={styles.menuItem(0.2)}>
                                        <AntDesign
                                            name='logout'
                                            size={24}
                                            color={COLORS.primary}
                                        />
                                        <Text style={styles.menuText}>
                                            Keluar
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}
