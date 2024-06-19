import { StyleSheet } from "react-native";
import { COLORS, SIZES, SHADOWS } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    marginBottom: SIZES.medium,
    textAlign: "center",
  },
  store: {
    marginTop: SIZES.medium,
    padding: SIZES.medium,
    backgroundColor: COLORS.offwhite,
    borderRadius: SIZES.small,
    ...SHADOWS.small,
  },
  storeName: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
    marginBottom: SIZES.small,
    color: COLORS.gray3,
  },
  product: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray1,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: SIZES.medium,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
  },
  productPrice: {
    color: COLORS.gray2,
  },
  productQty: {
    color: COLORS.gray2,
  },
});

export default styles;
