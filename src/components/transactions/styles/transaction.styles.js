import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    color: "green",
  },
  price: {
    fontSize: 14,
  },
  qty: {
    fontSize: 14,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default styles;
