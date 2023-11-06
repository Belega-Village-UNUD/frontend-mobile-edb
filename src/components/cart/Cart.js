import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import styles from './cart.style';
import { useNavigation } from '@react-navigation/native';

export default function Cart() {
    const navigation = useNavigation();
    return (
        <View>
            <View>
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
    );
}
