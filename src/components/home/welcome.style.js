import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    welcomeTxt: (color, top) => ({
        fontFamily: 'bold',
        fontSize: SIZES.xxLarge - 5,
        marginTop: top,
        color: color,
        marginHorizontal: SIZES.small,
    }),
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.medium,
        marginHorizontal: SIZES.small,
        marginVertical: SIZES.xSmall - 7,
        height: 50,
    },
    searchIcon: {
        marginHorizontal: 10,
        marginVertical: 10,
        color: COLORS.gray3,
    },
    searchWrapper: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        marginRight: SIZES.small,
        borderRadius: SIZES.small,
    },
    searchInput: {
        fontFamily: 'regular',
        width: '100%',
        height: '100%',
        paddingHorizontal: SIZES.small,
    },
    searchBtn: {
        width: 50,
        height: '100%',
        borderRadius: SIZES.medium,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColork: COLORS.primary,
    },
});

export default styles;
