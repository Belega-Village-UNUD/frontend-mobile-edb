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

export default function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [userLogin, setUserLogin] = useState(false);

    const handleCheckUserLogin = async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            const { email } = JSON.parse(user);
            if (email !== null) {
                setUserData({ email });
                setUserLogin(true);
            } else {
                setUserLogin(false);
            }
        } catch (e) {}
    };

    // useEffect(() => {
    //     handleCheckUserLogin();
    // }, []);
    useFocusEffect(
        React.useCallback(() => {
            handleCheckUserLogin();
        }, [])
    );

    const handleLogout = () => {
        Alert.alert('Logout', 'Apakah anda yakin ingin keluar?', [
            {
                text: 'Batal',
                onPress: () => console.log('Batal Logout'),
            },
            {
                text: 'Ya',
                onPress: () => {
                    AsyncStorage.removeItem('user');
                    setUserLogin(false);
                    console.log('Logout');
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
                        <TouchableOpacity>
                            <View style={styles.loginBtn}>
                                <Text style={styles.menuText}>
                                    {userData.email}
                                    {'        '}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    <ScrollView
                        style={{ flex: 1, marginBottom: 85 }}
                        showsVerticalScrollIndicator={false}
                    >
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
                                        <Text style={styles.menuText}>
                                            Favorit
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {}}>
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
                                        <Text style={styles.menuText}>
                                            Cart
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('Auth', {
                                            screen: 'Change Password',
                                        })
                                    }
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
                                    onPress={() => handleLogout()}
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
                                <TouchableOpacity
                                    onPress={() => deleteAccount()}
                                >
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
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}
