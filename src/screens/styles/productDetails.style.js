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
    paddingBottom: SIZES.large,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SIZES.width - 44,
    top: 20,
  },
  ratingRow: {
    paddingBottom: SIZES.small,
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 10,
    top: 5,
  },
  rating: {
    top: SIZES.medium,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: SIZES.large,
  },
  count: {
    top: SIZES.medium,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: SIZES.xxLarge + 30,
  },
  ratingReview: {
    flexDirection: "row",
    alignItems: "center",
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
    paddingHorizontal: SIZES.medium - 5,
    fontFamily: "semibold",
    fontSize: SIZES.medium,
  },
  priceWrapper: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.large,
    marginLeft: SIZES.large,
  },
  descriptionWrapper: {
    marginTop: SIZES.xSmall,
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
  storeNameContainer: {
    width: "75%",
    overflow: "hidden", // This will hide any child components (like the text) that go outside the boundaries of the view
  },
  storeName: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#888",
    marginHorizontal: 20,
    marginVertical: 20,
    paddingTop: 25,
  },
  // New styles for accordion and reviews
  accordionTitle: {
    fontSize: SIZES.h3,
    fontWeight: "bold",
    color: COLORS.primary,
    marginVertical: SIZES.small,
    marginHorizontal: SIZES.large,
  },
  reviewsContainer: {
    marginVertical: SIZES.small,
    marginHorizontal: SIZES.small,
  },
  noReview: {
    fontSize: SIZES.body3,
    color: COLORS.darkGray,
    textAlign: "left",
    marginVertical: SIZES.xSmall - 10,
    marginHorizontal: SIZES.large,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.small,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.base,
  },
  reviewerName: {
    marginHorizontal: SIZES.small,
    fontSize: SIZES.body3,
    fontWeight: "bold",
  },
  reviewText: {
    fontSize: SIZES.body3,
    color: COLORS.darkGray,
    marginBottom: SIZES.medium,
  },
  // New styles for review filter
  filterContainer: {
    flexDirection: "row",
    // justifyContent: "space-around",
    marginVertical: SIZES.small,
    marginHorizontal: SIZES.large,
  },
  filterButton: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    backgroundColor: COLORS.lightgray,
  },
  selectedFilterButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
  },
  filterButtonText: {
    fontSize: SIZES.body3,
    color: COLORS.darkGray,
  },
  selectedFilterButtonText: {
    color: COLORS.lightWhite,
  },
});

export default styles;
