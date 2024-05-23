import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import { StatusBar } from "react-native";

const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: COLORS.white,
    position: "absolute",
    zIndex: -1,
    bottom: "15%",
    height: "70%",
    borderRadius: SIZES.xxLarge,
  },
  containerStyle: {
    marginTop: StatusBarHeight,
    backgroundColor: COLORS.primary,
    width: "95%",
    alignSelf: "center",
    borderRadius: SIZES.radius,
  },
  label: {
    fontWeight: "bold",
    fontSize: 11.5,
  },
});

export default styles;
