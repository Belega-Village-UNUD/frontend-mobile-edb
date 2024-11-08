import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const styles = StyleSheet.create({
    cover: {
        height: SIZES.height / 2.4,
        width: SIZES.width - 60,
        resizeMode: 'contain',
        marginBottom: SIZES.xxLarge,
    },
    title: {
        fontSize: SIZES.xLarge,
        fontWeight: 'bold',
        color: COLORS.primary,
        paddingHorizontal: 25,
        marginBottom: SIZES.xxLarge,
    },
    wrapper: {
        marginBottom: 20,
        // marginHorizontal: 20,
    },
    label: {
        fontFamily: 'regular',
        fontSize: SIZES.xSmall,
        marginBottom: 5,
        marginEnd: 5,
        textAlign: 'right',
    },
    inputWrapper: (borderColor) => ({
        borderColor: borderColor,
        backgroundColor: COLORS.lightWhite,
        borderWidth: 1,
        height: 55,
        borderRadius: 12,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
    }),
    iconStyle: {
        marginRight: 10,
    },
    errorMessage: {
        color: COLORS.red,
        fontFamily: 'regular',
        marginTop: 5,
        marginLeft: 5,
        fontSize: SIZES.xSmall,
    },
    registration: {
        marginTop: 20,
        textAlign: 'left',
    },
    forgotPassword: {
        marginTop: 20,
        textAlign: 'right',
        textDecorationLine: 'underline',
        color: COLORS.primary,
    },
});

export default styles;
