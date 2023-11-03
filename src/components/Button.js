import { COLORS } from '../constants/theme';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Button({ title, onPress, isValid }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.btnStyle(
                isValid === false ? COLORS.gray3 : COLORS.primary
            )}
        >
            <Text style={styles.btnText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btnText: {
        fontFamily: 'bold',
        fontSize: 18,
        color: COLORS.white,
    },
    btnStyle: (backgroundColor) => ({
        height: 50,
        width: '100%',
        marginVertical: 20,
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    }),
});
