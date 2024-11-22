import { BASE_URI } from "@env";
import React, { useState, useEffect, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import Cart from "../components/cart/Cart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Button,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import CheckBox from "expo-checkbox";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartContext } from "../provider/CartProvider";
import { useNavigation } from "@react-navigation/native";
import { SIZES } from "../constants/theme";

const UPDATE_CART_URI = `${BASE_URI}/api/cart`;
const DELETE_CART_URI = `${BASE_URI}/api/cart`;
const CHECKOUT_URI = `${BASE_URI}/api/cart/checkout`;

export default function CartScreen() {
  const navigation = useNavigation();
  const [isAnyItemCheckedForCheckout, setIsAnyItemCheckedForCheckout] =
    useState(false);
  const { cartData, setCartData, fetchCartData } = useContext(CartContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentQty, setCurrentQty] = useState(0);
  const [currentProductId, setCurrentProductId] = useState(null);
  const totalQty = cartData
    ? cartData.reduce(
        (total, store) =>
          total +
          store.carts.reduce((totalQty, item) => totalQty + item.qty, 0),
        0
      )
    : 0;

  const handleUpdateQty = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(UPDATE_CART_URI, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: currentProductId,
          qty: currentQty,
        }),
      });

      const data = await response.json();
      console.log("Update Qty API Response:", data);

      if (data.success) {
        fetchCartData();
        Alert.alert("Berhasil mengubah qty barang");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleDeleteCart = async (cartId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(DELETE_CART_URI, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cart_id: cartId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchCartData();
        Alert.alert("Berhasil menghapus barang dari keranjang");
      }
    } catch (error) {
      Alert.alert("Gagal menghapus barang dari keranjang");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleStoreCheck = (storeId) => {
    let isAnyChecked = false;
    const updatedCartData = cartData.map((store) => {
      if (store.store.id === storeId) {
        const newCarts = store.carts.map((cart) => {
          const newCart = { ...cart, is_checkout: !store.is_checkout };
          if (newCart.is_checkout) isAnyChecked = true;
          return newCart;
        });
        return { ...store, carts: newCarts, is_checkout: !store.is_checkout };
      }
      return store;
    });
    setCartData(updatedCartData);
    setIsAnyItemCheckedForCheckout(
      isAnyChecked ||
        updatedCartData.some(
          (store) =>
            store.is_checkout || store.carts.some((cart) => cart.is_checkout)
        )
    );
  };

  // const handleCheckout = async () => {
  //   const token = await AsyncStorage.getItem("token");
  //   try {
  //     const checkoutItems = cartData.flatMap((store) =>
  //       store.carts
  //         .filter((cart) => cart.is_checkout)
  //         .map((cart) => ({ cart_id: cart.id, store_id: store.store.id }))
  //     );

  //     // Check if there are items selected for checkout
  //     if (checkoutItems.length === 0) {
  //       Alert.alert("No items selected for checkout");
  //       return;
  //     }

  //     // Group items by store
  //     // const stores = new Set(checkoutItems.map((item) => item.store_id));
  //     // if (stores.size > 1) {
  //     //   Alert.alert("Checkout error", "Anda tidak bisa checkout dari dua toko");
  //     //   return;
  //     // }

  //     const response = await fetch(CHECKOUT_URI, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(
  //         checkoutItems.map((item) => ({ cart_id: item.cart_id }))
  //       ), // Sending array of objects with cart_id
  //     });

  //     const data = await response.json();
  //     console.log("Checkout API Response:", data);

  //     if (response.status === 200 && data.success) {
  //       Alert.alert("Checkout berhasil", "Pesanan berhasil diproses", [
  //         {
  //           text: "OK",
  //           onPress: () => {
  //             fetchCartData(); // Reload the cart data after checkout
  //           },
  //         },
  //       ]);
  //     } else {
  //       Alert.alert("Checkout error", data.message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Checkout error", "An error occurred during checkout.");
  //   }
  // };

  // const handleCheckout = async () => {
  //   const token = await AsyncStorage.getItem("token");
  //   try {
  //     const checkoutItems = cartData.flatMap((store) =>
  //       store.carts
  //         .filter((cart) => cart.is_checkout)
  //         .map((cart) => ({ cart_id: cart.id, store_id: store.store.id }))
  //     );

  //     // Check if there are items selected for checkout
  //     if (checkoutItems.length === 0) {
  //       Alert.alert("No items selected for checkout");
  //       return;
  //     }

  //     // Group items by store
  //     const storeGroups = checkoutItems.reduce((acc, item) => {
  //       if (!acc[item.store_id]) {
  //         acc[item.store_id] = [];
  //       }
  //       acc[item.store_id].push(item.cart_id);
  //       return acc;
  //     }, {});

  //     // Send separate requests for each store
  //     const promises = Object.keys(storeGroups).map(async (storeId) => {
  //       const response = await fetch(CHECKOUT_URI, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(
  //           storeGroups[storeId].map((cart_id) => ({ cart_id }))
  //         ),
  //       });

  //       const data = await response.json();
  //       console.log("Checkout API Response:", data);

  //       if (response.status === 200 && data.success) {
  //         return { success: true };
  //       } else {
  //         return { success: false, message: data.message };
  //       }
  //     });

  //     const results = await Promise.all(promises);

  //     if (results.every((result) => result.success)) {
  //       Alert.alert("Checkout berhasil", "Pesanan berhasil diproses", [
  //         {
  //           text: "OK",
  //           onPress: () => {
  //             fetchCartData(); // Reload the cart data after checkout
  //           },
  //         },
  //       ]);
  //     } else {
  //       const errorMessage = results
  //         .filter((result) => !result.success)
  //         .map((result) => result.message)
  //         .join("\n");
  //       Alert.alert("Checkout error", errorMessage);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Checkout error", "An error occurred during checkout.");
  //   }
  // };

  const handleCheckout = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const checkoutItems = cartData.flatMap((store) =>
        store.carts
          .filter((cart) => cart.is_checkout)
          .map((cart) => ({ cart_id: cart.id, store_id: store.store.id }))
      );

      // Check if there are items selected for checkout
      if (checkoutItems.length === 0) {
        Alert.alert("No items selected for checkout");
        return;
      }

      // Group items by store and separate each item into a new transaction
      const storeGroups = checkoutItems.reduce((acc, item) => {
        if (!acc[item.store_id]) {
          acc[item.store_id] = [];
        }
        acc[item.store_id].push(item.cart_id);
        return acc;
      }, {});

      // Send separate requests for each item in each store
      const promises = Object.keys(storeGroups).flatMap((storeId) =>
        storeGroups[storeId].map(async (cart_id) => {
          const response = await fetch(CHECKOUT_URI, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify([{ cart_id }]),
          });

          const data = await response.json();
          console.log("Checkout API Response:", data);

          if (response.status === 200 && data.success) {
            return { success: true };
          } else {
            return { success: false, message: data.message };
          }
        })
      );

      const results = await Promise.all(promises);

      if (results.every((result) => result.success)) {
        Alert.alert("Checkout berhasil", "Pesanan berhasil diproses", [
          {
            text: "OK",
            onPress: () => {
              fetchCartData(); // Reload the cart data after checkout
            },
          },
        ]);
      } else {
        const errorMessage = results
          .filter((result) => !result.success)
          .map((result) => result.message)
          .join("\n");
        Alert.alert("Checkout error", errorMessage);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Checkout error", "An error occurred during checkout.");
    }
  };

  const handleProductCheck = (storeId, productId) => {
    let isAnyChecked = false;
    const updatedCartData = cartData.map((store) => {
      if (store.store.id === storeId) {
        const newCarts = store.carts.map((cart) => {
          if (cart.id === productId) {
            const newCart = { ...cart, is_checkout: !cart.is_checkout };
            if (newCart.is_checkout) isAnyChecked = true;
            return newCart;
          }
          return cart;
        });
        return { ...store, carts: newCarts };
      }
      return store;
    });
    setCartData(updatedCartData);
    setIsAnyItemCheckedForCheckout(
      isAnyChecked ||
        updatedCartData.some(
          (store) =>
            store.is_checkout || store.carts.some((cart) => cart.is_checkout)
        )
    );
  };

  const renderProduct = ({ item, storeId }) => (
    <View style={styles.product}>
      <CheckBox
        value={item.is_checkout}
        onValueChange={() => handleProductCheck(storeId, item.id)}
        style={styles.checkbox}
      />
      <Image
        source={
          item.images && item.images.length > 0
            ? { uri: item.images[0] }
            : require("../assets/no-image-card.png")
        }
        style={styles.productImage}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name_product}</Text>
        <View style={styles.productInfo}>
          <Text style={styles.productPrice}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(item.price * item.qty)}
          </Text>
          <View style={styles.qtyContainer}>
            <Text style={styles.productQty}>{item.qty}</Text>
            <TouchableOpacity
              onPress={() => {
                setCurrentProductId(item.product_id);
                setCurrentQty(item.qty);
                setModalVisible(true);
              }}
            >
              <Ionicons
                name="create-outline"
                size={24}
                color="green"
                style={{ paddingBottom: 5 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Hapus barang dari keranjang?", "", [
                  { text: "Batal", style: "cancel" },
                  { text: "Hapus", onPress: () => handleDeleteCart(item.id) },
                ]);
              }}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color="red"
                style={{ paddingBottom: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStore = ({ item }) => (
    <View style={styles.store}>
      <View style={styles.storeHeader}>
        <CheckBox
          value={item.is_checkout}
          onValueChange={() => handleStoreCheck(item.store.id)}
        />
        <Text style={styles.storeName}>{item.store.name}</Text>
      </View>
      <FlatList
        data={item.carts}
        renderItem={(props) =>
          renderProduct({ ...props, storeId: item.store.id })
        }
        keyExtractor={(product) => product.id}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Cart itemCount={totalQty} />
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cartData}
        renderItem={renderStore}
        keyExtractor={(store) => store.store.id}
      />
      {isAnyItemCheckedForCheckout && (
        <View style={styles.checkoutButtonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={handleCheckout}>
            <Text style={styles.buttonText}>Proses</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Update Quantity</Text>
            <TextInput
              style={styles.modalInput}
              value={String(currentQty)}
              onChangeText={(text) => setCurrentQty(Number(text))}
              keyboardType="numeric"
            />
            <Button title="Update" onPress={handleUpdateQty} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  buttonStyle: {
    backgroundColor: "#53B175",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  store: {
    marginTop: SIZES.xLarge,
    padding: SIZES.medium,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  storeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginLeft: SIZES.large,
  },
  product: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginEnd: SIZES.xxLarge,
  },
  checkbox: {
    marginRight: SIZES.medium,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: SIZES.medium,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  productPrice: {
    fontSize: 16,
    color: "#666",
  },
  productQty: {
    fontSize: 16,
    color: "#666",
    paddingLeft: 10,
    paddingBottom: 5,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    textAlign: "center",
  },
  checkoutButtonContainer: {
    marginVertical: 20, // Adjust the margin as needed
    paddingHorizontal: 10, // Adjust padding as needed
  },
  cbBtn: {},
});
