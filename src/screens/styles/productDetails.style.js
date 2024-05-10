import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },

  upperRow: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: SIZES.xxLarge,
    width: SIZES.width - 44,
    zIndex: 999,
  },

  image: {
    aspectRatio: 1,
    resizeMode: "cover",
  },

  details: {
    marginTop: -SIZES.large,
    backgroundColor: COLORS.lightWhite,
    width: SIZES.width,
    borderTopLeftRadius: SIZES.medium,
    borderTopRightRadius: SIZES.medium,
  },

  titleRow: {
    marginHorizontal: 20,
    paddingBottom: SIZES.small,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SIZES.width - 44,
    top: 20,
  },

  ratingRow: {
    paddingBottom: SIZES.small,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SIZES.width - 10,
    top: 5,
  },

  rating: {
    top: SIZES.large,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: SIZES.large,
  },

  ratingText: {
    color: COLORS.gray,
    fontFamily: "medium",
    top: 2,
  },

  title: {
    fontFamily: "bold",
    fontSize: SIZES.large,
  },

  price: {
    paddingHorizontal: 10,
    fontFamily: "semibold",
    fontSize: SIZES.large,
  },

  priceWrapper: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.large,
  },

  descriptionWrapper: {
    marginTop: SIZES.large * 2,
    marginHorizontal: SIZES.large,
  },

  description: {
    fontFamily: "medium",
    fontSize: SIZES.large - 2,
  },

  descriptionText: {
    fontFamily: "regular",
    fontSize: SIZES.large - 4,
    textAlign: "justify",
    marginBottom: SIZES.small,
  },

  cartRow: {
    paddingBottom: SIZES.small,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SIZES.width - 44,
  },

  soldOutBtn: {
    width: SIZES.width * 0.7,
    backgroundColor: COLORS.gray3,
    padding: SIZES.small / 2,
    borderRadius: SIZES.large,
    marginLeft: 12,
  },

  cartBtn: {
    width: SIZES.width * 0.7,
    backgroundColor: COLORS.primary,
    padding: SIZES.small / 2,
    borderRadius: SIZES.large,
    marginLeft: 12,
  },

  addCart: {
    width: 37,
    height: 37,
    borderRadius: 50,
    margin: SIZES.small,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  sellerChat: {
    width: 37,
    height: 37,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  cartTitle: {
    fontFamily: "semibold",
    fontSize: SIZES.medium,
    textAlign: "center",
    color: COLORS.lightWhite,
  },
});

export default styles;
