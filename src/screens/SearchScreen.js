import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import styles from './styles/search.style';
import { COLORS } from '../constants/theme';

export default function SearchScreen() {
    return (
        <SafeAreaView>
            <View style={styles.searchContainer}>
                <TouchableOpacity>
                    <Feather
                        name='search'
                        size={24}
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
                <View style={styles.searchWrapper}>
                    <TextInput
                        style={styles.searchInput}
                        onPressIn={() => {}}
                        placeholder='Apa yang sedang kamu cari?'
                    />
                </View>
                <View>
                    <TouchableOpacity style={styles.searchBtn}>
                        <Feather
                            name='arrow-right-circle'
                            size={24}
                            color={COLORS.gray3}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
