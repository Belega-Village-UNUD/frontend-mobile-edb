import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    width: 170,
    height: 240,
    padding: 8,
    marginEnd: 12,
    borderRadius: SIZES.medium,
    backgroundColor: COLORS.secondary,
  },

  imageContainer: {
    flex: 1,
    borderRadius: SIZES.medium,
    width: 140,
    marginLeft: SIZES.small / 2,
    marginTop: SIZES.small / 2,
    overflow: "hidden",
  },

  image: {
    aspectRatio: 1,
    resizeMode: "cover",
  },

  details: {
    padding: SIZES.small,
  },

  title: {
    fontFamily: "bold",
    fontSize: SIZES.large,
  },

  store: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    color: COLORS.gray,
  },

  price: {
    fontFamily: "bold",
    fontSize: SIZES.medium,
  },

  addButton: {
    position: "absolute",
    bottom: SIZES.small,
    right: SIZES.small,
  },
});

export default styles;
