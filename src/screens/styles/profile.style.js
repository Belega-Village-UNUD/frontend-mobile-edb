import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  cover: {
    height: 290,
    width: "100%",
    resizeMode: "cover",
  },
  profileContainer: {
    flex: 1,
    alignItems: "center",
  },
  profile: {
    height: 155,
    width: 155,
    borderRadius: 999,
    borderColor: COLORS.primary,
    borderWidth: 2,
    resizeMode: "cover",
    marginTop: -80,
  },
  name: {
    fontFamily: "bold",
    color: COLORS.primary,
    marginVertical: 5,
  },
  loginBtn: {
    backgroundColor: COLORS.secondary,
    padding: 2,
    borderWidth: 0.4,
    borderColor: COLORS.primary,
    borderRadius: SIZES.xxLarge,
  },
  menuText: {
    fontFamily: "regular",
    color: COLORS.gray,
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 22,
  },
  menuWrapper: {
    marginTop: SIZES.xLarge,
    width: SIZES.width - SIZES.large,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 12,
  },
  menuItem: (borderBottomWidth) => ({
    borderBottomWidth: borderBottomWidth,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderColor: COLORS.gray3,
    flexDirection: "row",
  }),
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 12,
    padding: 5,
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
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  }),
  iconStyle: {
    marginRight: 10,
  },
  errorMessage: {
    color: COLORS.red,
    fontFamily: "regular",
    marginTop: 5,
    marginLeft: 5,
    fontSize: SIZES.xSmall,
  },
  redDot: {
    position: "absolute",
    right: 0,
    top: 20,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
});

export default styles;
