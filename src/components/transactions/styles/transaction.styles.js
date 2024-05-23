import { StyleSheet } from "react-native";
import { COLORS, SIZES, SHADOWS } from "../../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: SIZES.medium,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: COLORS.offwhite,
    ...SHADOWS.small,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: SIZES.medium,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
  },
  status: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  price: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
  },
  qty: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
  },
  message: {
    fontSize: SIZES.medium,
    textAlign: "center",
    color: COLORS.gray3,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.medium,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    flex: 1,
    alignItems: "center",
    marginRight: SIZES.small,
  },
  declineButton: {
    backgroundColor: COLORS.red,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    flex: 1,
    alignItems: "center",
    marginLeft: SIZES.small,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  modalButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    flex: 1,
    alignItems: "center",
    marginRight: SIZES.small,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.medium,
  },
  modalButtonClose: {
    backgroundColor: COLORS.red,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    flex: 1,
    alignItems: "center",
    marginLeft: SIZES.small,
  },
});

export default styles;
