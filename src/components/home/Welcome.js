import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './welcome.style';
import { COLORS, SIZES } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.welcomeTxt(COLORS.gray3, SIZES.xSmall)}>
                Cari Furniture Bambu yang
            </Text>
            <Text style={styles.welcomeTxt(COLORS.primary, SIZES.xSmall)}>
                Kamu Banget!
            </Text>
            <TouchableOpacity
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: SIZES.xxLarge,
                }}
                onPress={() => {
                    navigation.navigate('Auth', { screen: 'Login' });
                }}
            >
                <Text>Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
