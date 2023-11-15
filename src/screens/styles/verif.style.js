import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const styles = StyleSheet.create({
    topHalf: {
        height: SIZES.height * 0.5,
    },
    iconBg: {
        width: SIZES.width * 0.5,
        height: SIZES.width * 0.5,
        borderRadius: SIZES.width * 0.5,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: SIZES.height * 0.1,
    },
    iconVerif: {
        paddingTop: SIZES.height * -5,
    },
    bottomHalf: {
        height: '50%',
    },
    // help me to create ideal styling for screen Verification such as for Page Title and Page Description
    pageTitle: {
        fontFamily: 'bold',
        fontSize: SIZES.xxLarge - 2,
        color: COLORS.primary,
        textAlign: 'center',
    },
    pageDesc: {
        fontFamily: 'regular',
        fontSize: SIZES.medium,
        color: COLORS.gray3,
        textAlign: 'center',
        marginTop: SIZES.medium * 0.5,
    },
    verifBtn: {
        marginTop: SIZES.medium * 3,
    },

    wrapper: {
        marginBottom: 20,
        // marginHorizontal: 20,
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
        marginTop: 15,
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
    resendOtp: {
        marginTop: 25,
        textAlign: 'center',
    },
});

export default styles;
