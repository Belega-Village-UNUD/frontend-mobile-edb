import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView } from 'react-native';
import styles from './styles/home.style';
import { Welcome, Cart, Carousel } from '../components';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.appBarWrapper}>
                    <View style={styles.appBar}>
                        <Cart />
                    </View>
                </View>
            </View>
            <ScrollView>
                <Welcome />
                <Carousel />
            </ScrollView>
        </SafeAreaView>
    );
}
