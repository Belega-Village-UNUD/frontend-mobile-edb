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
        height: SIZES.height * 0.5,
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
        marginTop: SIZES.xxLarge * 2,
    },
});

export default styles;
