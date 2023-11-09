import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles/verif.style';
import { COLORS, SIZES } from '../constants/theme';
import { Button } from '../components';

export default function VerificationScreen() {
    return (
        <SafeAreaView style={{ marginHorizontal: 20 }}>
            <View style={styles.topHalf}>
                <View style={styles.iconBg}>
                    <View style={styles.iconVerif}>
                        <Ionicons
                            name='mail-open-outline'
                            size={SIZES.xxLarge + 80}
                            color={COLORS.primary}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.bottomHalf}>
                <Text style={styles.pageTitle}>Verifikasi Akun</Text>
                <Text style={styles.pageDesc}>
                    Tolong verifikasi akun anda menggunakan tautan yang dikirim
                    ke{' '}
                </Text>
                <View style={styles.verifBtn}>
                    <Button
                        title={'V E R I F I K A S I'}
                        onPress={() => {
                            console.log('Verifikasi Akun');
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
