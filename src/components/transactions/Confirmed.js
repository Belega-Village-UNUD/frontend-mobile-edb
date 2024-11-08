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

const CANCEL_URI = `${BASE_URI}/api/transaction/buyer/cancel/`;
const noImage = require("../../assets/no-image-card.png");

const Confirmed = ({ transactions, handleGetAllTransactions, screen }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [transaction, setTransaction] = useState(transactions);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("price");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [redirectLink, setRedirectLink] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setTransaction(transactions);
  }, [transactions]);

  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        setModalVisible(false);
        return true;
      }
      if (redirectLink) {
        setRedirectLink(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [modalVisible, redirectLink]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleGetAllTransactions().then(() => setRefreshing(false));
  }, []);

  const confirmedTransactions = transactions
    ? transactions.filter((transaction) => transaction.status === "PAYABLE")
    : [];

  const navigateToOrderDetailsScreen = (orderId) => {
    navigation.navigate("OrderDetail", { orderId });
  };

  const navigateToTransactionDetailsScreen = (transactionId) => {
    navigation.navigate("TransactionDetail", { transactionId });
  };

  const handlePayTransaction = async (transactionId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const transactionToPay = transactions.find(
        (transaction) => transaction.id === transactionId
      );

      if (transactionToPay && transactionToPay.redirect_url) {
        setRedirectLink(transactionToPay.redirect_url);
      }
    } catch (error) {
      console.error(error);
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

  const openCancelModal = (transactionId) => {
    setSelectedTransaction(transactionId);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const hasMultipleProducts =
      item.cart_details.filter((cartDetail) => cartDetail.product).length > 1;

    return (
      <TouchableOpacity
        onPress={() => {
          if (screen === "SellerTransactionScreen") {
            navigateToTransactionDetailsScreen(item.id);
          } else {
            navigateToOrderDetailsScreen(item.id);
          }
        }}
        delayPressIn={5000}
      >
        <View
          style={[
            styles.itemContainer,
            item.cart_details.length > 1 && styles.itemContainerColumn,
          ]}
        >
          {item.cart_details.map((cartDetail) => (
            <React.Fragment key={cartDetail.id}>
              {cartDetail.product && (
                <View style={styles.productContainer}>
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
                </View>
              )}
            </React.Fragment>
          ))}
          <Text style={[styles.price, styles.centerText]}>
            Total Price: {item.total_amount}
          </Text>
          {screen === "OrderScreen" && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                title="Pay"
                onPress={() => {
                  handlePayTransaction(item.id);
                }}
                delayPressIn={1000}
              >
                <Text style={styles.buttonText}>Bayar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                title="Cancel"
                onPress={() => openCancelModal(item.id)}
                delayPressIn={1000}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
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
          data={confirmedTransactions}
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
                delayPressIn={1000}
              >
                <Text style={styles.modalButtonText}>Kirim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonClose}
                title="Close"
                onPress={() => setModalVisible(false)}
                delayPressIn={1000}
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

export default Confirmed;
