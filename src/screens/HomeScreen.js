import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles/home.style';
import { Ionicons, Fontisto } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { ScrollView } from 'react-native-gesture-handler';
import { Welcome } from '../components';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.appBarWrapper}>
                <View style={styles.appBar}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Cart');
                        }}
                    >
                        <Ionicons
                            name='cart-outline'
                            size={24}
                            color={COLORS.gray3}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <View style={styles.cartCount}>
                        <Text style={styles.cartNumber}>8</Text>
                    </View>
                </View>
            </View>
            <ScrollView>
                <Welcome />
            </ScrollView>
        </SafeAreaView>
    );
}
