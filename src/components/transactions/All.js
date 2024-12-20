import { BASE_URI } from "@env";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
  BackHandler,
} from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "./styles/transaction.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

const CONFIRM_URI = `${BASE_URI}/api/transaction/confirm/`;
const DECLINE_URI = `${BASE_URI}/api/transaction/decline/`;
const CANCEL_URI = `${BASE_URI}/api/transaction/buyer/cancel/`;
const GET_ONE_URI = `${BASE_URI}/api/transaction/buyer/`;
const ARRIVED_URI = `${BASE_URI}/api/shipping/arrived`;
const SENDING_URI = `${BASE_URI}/api/shipping/seller/send`;

const noImage = require("../../assets/no-image-card.png");

const All = ({ transactions, handleGetAllTransactions, screen }) => {
  const [transaction, setTransaction] = useState(transactions);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("price");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [redirectLink, setRedirectLink] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentTransactionId, setPaymentTransactionId] = useState(null);
  const navigation = useNavigation();

  const navigateToOrderDetailsScreen = (orderId) => {
    navigation.navigate("OrderDetail", { orderId });
  };

  const navigateToTransactionDetailsScreen = (transactionId) => {
    navigation.navigate("TransactionDetail", { transactionId });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleGetAllTransactions().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    setTransaction(transactions);
  }, [transactions]);

  useEffect(() => {
    const backAction = () => {
      if (redirectLink) {
        setRedirectLink(null);
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [redirectLink]);

  const handlePay = async (id) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(`${GET_ONE_URI}${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.status === 200 && result.success) {
        const redirectUrl = result.data.redirect_url;
        if (redirectUrl) {
          setRedirectLink(redirectUrl);
          setPaymentTransactionId(id);
        } else {
          Alert.alert("Silahkan kalkulasi ongkir anda terlebih dahulu");
        }
      } else {
        console.error("Failed to retrieve transaction");
      }
    } catch (error) {
      console.error("Failed to pay transaction", error);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${BASE_URI}/api/transaction/buyer/${paymentTransactionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }

      const data = await response.json();
    } catch (error) {
      console.log("Failed to update transaction status", error);
    }
  };

  const handleCancelTransaction = async (transactionId) => {
    let reason;
    if (selectedReason === "other") {
      if (cancelReason.trim() === "") {
        Alert.alert("Error", "Anda harus memasukkan alasan pembatalan");
        return;
      }
      reason = cancelReason;
    } else {
      reason =
        selectedReason === "price" ? "Harga Terlalu Mahal" : "Berubah Pikiran";
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${CANCEL_URI}${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: reason,
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }

      const data = await response.json();
      console.log(data);
      if (data.success) {
        const updatedTransactions = transactions.map((item) => {
          if (item.id === transactionId) {
            return data.data;
          } else {
            return item;
          }
        });

        setTransaction(updatedTransactions);
      }

      setModalVisible(false);
      Alert.alert("Success", "Pembatalan transaksi berhasil", [
        {
          text: "OK",
          onPress: () => handleGetAllTransactions(),
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = async (transactionId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(`${CONFIRM_URI}${transactionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(`Failed to confirm transaction: ${response.status}`);
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error("Failed to parse JSON", error);
        return;
      }

      if (data.success) {
        const updatedTransactions = transaction.map((item) => {
          if (item.id === transactionId) {
            return data.data;
          } else {
            return item;
          }
        });

        setTransaction(updatedTransactions);
        Alert.alert("Success", "Konfirmasi Pesanan Berhasil", [
          { text: "OK", onPress: () => handleGetAllTransactions() },
        ]);
      } else {
        Alert.alert("Failure", "Gagal Konfirmasi Pesanan", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (error) {
      console.error("Failed to confirm transaction", error);
    }
  };

  const handleDecline = async (transactionId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(`${DECLINE_URI}${transactionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedTransactions = transaction.map((item) => {
          if (item.id === transactionId) {
            return data.data;
          } else {
            return item;
          }
        });

        setTransaction(updatedTransactions);
        Alert.alert("Success", "Berhasil Menolak Pesanan", [
          { text: "OK", onPress: () => handleGetAllTransactions() },
        ]);
      } else {
        Alert.alert("Failure", "Gagal Menolak Pesanan", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (error) {
      console.error("Gagal Menolak Pesanan", error);
    }
  };

  const handleArrived = async (transactionId, storeId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const payload = {
        store_id: storeId,
        transaction_id: transactionId,
      };

      // Log the payload to verify its content
      console.log("Payload being sent to server:", payload);

      const response = await fetch(ARRIVED_URI, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Barang telah sampai di rumah pembeli.");
        handleGetAllTransactions();
      } else {
        Alert.alert("Failure", "Gagal mengonfirmasi barang telah sampai.");
      }
    } catch (error) {
      console.error("Gagal mengonfirmasi barang telah sampai", error);
      Alert.alert("Error", "Gagal mengonfirmasi barang telah sampai.");
    }
  };

  const renderItem = ({ item }) => {
    // Check if there are any cart details with a product
    if (
      item.cart_details.filter((cartDetail) => cartDetail.product).length > 0
    ) {
      const isMultipleProducts = item.cart_details.length > 1;

      return (
        <TouchableOpacity
          onPress={() => {
            if (screen === "SellerTransactionScreen") {
              navigateToTransactionDetailsScreen(item.id);
            } else {
              navigateToOrderDetailsScreen(item.id);
            }
          }}
          delayPressIn={500}
        >
          <View
            style={[
              styles.itemContainer,
              isMultipleProducts && styles.itemContainerColumn,
            ]}
          >
            {item.cart_details.map((cartDetail, index) => (
              <View key={cartDetail.id} style={styles.productContainer}>
                {cartDetail.product && (
                  <>
                    <Image
                      style={styles.image}
                      source={
                        cartDetail.product.images &&
                        cartDetail.product.images.length > 0
                          ? { uri: cartDetail.product.images[0] }
                          : noImage
                      }
                    />
                    <View style={styles.infoContainer}>
                      <Text style={styles.productName}>
                        {cartDetail.product.name_product}
                      </Text>
                      <Text style={styles.status}>Status: {item.status}</Text>
                      <Text style={styles.shippingStatus}>
                        Shipping Status:{" "}
                        {cartDetail.arrival_shipping_status === "UNCONFIRMED"
                          ? "Belum Dikirim"
                          : cartDetail.arrival_shipping_status === "PACKING"
                          ? "Disiapkan"
                          : cartDetail.arrival_shipping_status === "SHIPPED"
                          ? "Dikirim"
                          : cartDetail.arrival_shipping_status === "ARRIVED"
                          ? "Sampai"
                          : "Belum Dikirim"}
                      </Text>
                      <Text style={styles.qty}>Quantity: {cartDetail.qty}</Text>
                    </View>
                  </>
                )}
              </View>
            ))}
            <Text style={[styles.price, styles.centerText]}>
              Total Price: {item.total_amount}
            </Text>
            {item.status === "PENDING" &&
              screen === "SellerTransactionScreen" && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    title="Confirm"
                    onPress={() => {
                      handleConfirm(item.id);
                    }}
                    delayPressIn={500}
                  >
                    <Text style={styles.buttonText}>Konfirmasi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    title="Decline"
                    onPress={() => handleDecline(item.id)}
                    delayPressIn={500}
                  >
                    <Text style={styles.buttonText}>Tolak</Text>
                  </TouchableOpacity>
                </View>
              )}
            {item.status === "SUCCESS" &&
              screen === "SellerTransactionScreen" &&
              item.cart_details.some(
                (cartDetail) =>
                  cartDetail.arrival_shipping_status === "PACKING" && (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.confirmButton}
                        title="Arrived"
                        onPress={() => {
                          navigateToTransactionDetailsScreen(item.id);
                        }}
                        delayPressIn={500}
                      >
                        <Text style={styles.buttonText}>Kirim</Text>
                      </TouchableOpacity>
                    </View>
                  )
              )}
            {item.status === "PAYABLE" && screen === "OrderScreen" && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  title="Pay"
                  onPress={() => {
                    handlePay(item.id);
                  }}
                  delayPressIn={500}
                >
                  <Text style={styles.buttonText}>Bayar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineButton}
                  title="Cancel"
                  onPress={() => {
                    setSelectedTransaction(item.id);
                    setModalVisible(true);
                  }}
                  delayPressIn={500}
                >
                  <Text style={styles.buttonText}>Batal</Text>
                </TouchableOpacity>
              </View>
            )}
            {item.status === "SUCCESS" &&
              screen === "OrderScreen" &&
              item.cart_details.some(
                (cartDetail) => cartDetail.arrival_shipping_status === "SHIPPED"
              ) && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    title="Arrived"
                    onPress={() => {
                      navigateToOrderDetailsScreen(item.id);
                    }}
                    delayPressIn={500}
                  >
                    <Text style={styles.buttonText}>Pesanan Diterima</Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </TouchableOpacity>
      );
    } else {
      // Optionally, return null or a placeholder if there are no products
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {redirectLink ? (
        <WebView
          source={{ uri: redirectLink }}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          onNavigationStateChange={(navState) => {
            const url = navState.url;
            // Check if the URL ends with '#/409'
            if (
              url.endsWith("#/409") ||
              url.endsWith("#/success") ||
              url.endsWith("#/407")
            ) {
              // Redirect back to your app
              setTimeout(() => {
                setRedirectLink(null);
                handlePaymentSuccess(selectedTransaction);
              }, 2000);
            }
          }}
        />
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
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
            <Text style={styles.modalText}>Pilih alasan pembatalan:</Text>
            <RadioButton.Group
              onValueChange={(newValue) => {
                setSelectedReason(newValue);
              }}
              value={selectedReason}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <RadioButton value="price" />
                <Text style={{ marginRight: 10 }}>Harga Terlalu Mahal</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <RadioButton value="change" />
                <Text style={{ marginRight: 10 }}>Berubah Pikiran</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <RadioButton value="other" />
                <Text style={{ marginRight: 10 }}>Lainnya</Text>
              </View>
            </RadioButton.Group>
            {selectedReason === "other" && (
              <TextInput
                style={styles.modalInput}
                onChangeText={setCancelReason}
                value={cancelReason}
                placeholder="Masukkan alasan pembatalan"
              />
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                title="Submit"
                onPress={() => {
                  handleCancelTransaction(selectedTransaction);
                }}
              >
                <Text style={styles.modalButtonText}>Kirim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonClose}
                title="Close"
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default All;
