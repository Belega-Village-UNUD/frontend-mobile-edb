import { StyleSheet } from "react-native";
import { SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.medium,
    // marginBottom: -SIZES.xSmall,
    marginHorizontal: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  headerText: {
    marginStart: 12,
    fontFamily: "semibold",
    fontSize: SIZES.xLarge - 2,
  },
});

export default styles;
