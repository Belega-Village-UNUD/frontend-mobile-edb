import { BASE_URI } from "@env";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "./styles/transaction.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebView from "react-native-webview";

const CANCEL_URI = `${BASE_URI}/api/transaction/buyer/cancel/`;
const noImage = require("../../assets/no-image-card.png");

const Confirmed = ({ transactions, handleGetAllTransactions, screen }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [transaction, setTransaction] = useState(transactions);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("price");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);

  const confirmedTransactions = transactions
    ? transactions.filter((transaction) => transaction.status === "PAYABLE")
    : [];

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
        setRedirectUrl(transactionToPay.redirect_url);
      }
    } catch (error) {
      console.error(error);
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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.cart_details.map((cartDetail) => (
        <React.Fragment key={cartDetail.id}>
          {cartDetail.product ? (
            <>
              <Image
                style={styles.image}
                source={
                  cartDetail.product.image_product
                    ? { uri: cartDetail.product.image_product }
                    : noImage
                }
              />
              <View style={styles.infoContainer}>
                <Text style={styles.productName}>
                  {cartDetail.product.name_product}
                </Text>
                <Text style={styles.status}>Status: {item.status}</Text>
                <Text style={styles.price}>
                  Price: {cartDetail.unit_price * cartDetail.qty}
                </Text>
                <Text style={styles.qty}>Quantity: {cartDetail.qty}</Text>
                {screen === "OrderScreen" && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      title="Pay"
                      onPress={() => {
                        handlePayTransaction(item.id);
                      }}
                    >
                      <Text style={styles.buttonText}>Pay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.declineButton}
                      title="Cancel"
                      onPress={() => openCancelModal(item.id)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          ) : (
            <Text>No product details available</Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {redirectUrl ? (
        <WebView source={{ uri: redirectUrl }} />
      ) : (
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
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonClose}
                  title="Close"
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {confirmedTransactions.length > 0 ? (
        <FlatList
          data={confirmedTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Belum ada transaksi yang dikonfirmasi oleh anda
          </Text>
        </View>
      )}
    </View>
  );
};

export default Confirmed;
