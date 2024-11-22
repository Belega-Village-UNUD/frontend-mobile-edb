import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginHorizontal: SIZES.medium,
    marginVertical: SIZES.xSmall,
    marginRight: SIZES.xLarge,
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
    fontFamily: "regular",
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.small,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    backgroundColork: COLORS.primary,
  },
  container: {
    alignItems: "center",
    // paddingTop: SIZES.xxLarge,
    paddingLeft: SIZES.small / 2,
    paddingBottom: SIZES.large,
  },
  separator: {
    height: 16,
  },
  reviewCard: {
    marginVertical: SIZES.small,
    marginHorizontal: SIZES.small,
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
  productCardContainer: {
    marginStart: SIZES.xSmall,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: SIZES.small,
  },
  productName: {
    fontSize: SIZES.small,
    color: COLORS.darkGray,
  },
  ratingReview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SIZES.small,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: SIZES.small,
  },
  filterButton: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    backgroundColor: COLORS.lightGray,
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
  noDataText: {
    textAlign: "center",
    marginTop: SIZES.medium,
    color: COLORS.darkGray,
  },
});

export default styles;
