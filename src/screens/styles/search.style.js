import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginHorizontal: SIZES.small,
    marginVertical: SIZES.xSmall,
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
  // Add these styles to your existing styles
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderColor: COLORS.gray3,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
});

export default styles;
