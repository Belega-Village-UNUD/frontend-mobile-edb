import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xSmall / 2,
    marginLeft: 18,
  },
  refreshLink: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});

export default styles;
