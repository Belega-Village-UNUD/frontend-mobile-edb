import { BASE_URI } from "@env";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/theme";
import styles from "./styles/profile.style";

const AVATAR_URI = BASE_URI + "/api/profiles/avatar";
const PROFILE_URI = BASE_URI + "/api/profiles";
const OTP_URI = BASE_URI + "/api/auth/otp";
const DEFAULT_AVATAR = require("../assets/images/userDefault.png");

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [userLogin, setUserLogin] = useState(false);
  const [userImage, setUserImage] = useState(null);

  const handleUpdateAvatar = async (imageUri) => {
    let formData = new FormData();
    let fileExtension = imageUri.split(".").pop();
    formData.append("avatar", {
      uri: imageUri,
      type: `image/${fileExtension}`,
      name: `avatar.${fileExtension}`,
    });
    let token = await AsyncStorage.getItem("token");
    try {
      const response = await axios({
        method: "post",
        url: AVATAR_URI,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserImage(response.data.data.url);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePickImage = async () => {
    Alert.alert(
      "Upload Avatar",
      "Pilih Sumber Gambar",
      [
        {
          text: "📷 Camera",
          onPress: async () => {
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.2,
            });

            if (!result.canceled) {
              const imageUri = result.assets[0].uri;
              setUserImage(imageUri);
              handleUpdateAvatar(imageUri);
            }
          },
        },
        {
          text: "🖼️ Gallery",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.2,
            });

            if (!result.canceled) {
              const imageUri = result.assets[0].uri;
              setUserImage(imageUri);
              handleUpdateAvatar(imageUri);
            }
          },
        },
        // {
        //   text: "🗑️ Hapus Avatar",
        //   onPress: async () => {
        //     setUserImage(null);
        //     handleUpdateAvatar(null);
        //   },
        // },
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleCheckUserLogin = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await axios.get(PROFILE_URI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { email, is_verified } = response.data.data.user;
      const { name, phone, address } = response.data.data.profile;
      if (response.data.status === 200) {
        setUserData({ email, is_verified, name, phone, address });
        setUserLogin(true);
        setUserImage(response.data.data.profile.avatar_link);
        console.log(name, phone, address);
      } else {
        setUserLogin(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleOptionClick = (option) => {
    if (
      !userData.is_verified &&
      option !== "logout" &&
      option !== "resendOtp" &&
      option !== "profile"
    ) {
      Alert.alert(
        "Verifikasi Akun",
        "Akun anda belum terverifikasi, silahkan verifikasi akun anda terlebih dahulu."
      );
    } else {
      switch (option) {
        case "favorite":
          navigation.navigate("Favorite");
          break;
        case "order":
          navigation.navigate("Order");
          break;
        case "cart":
          navigation.navigate("Cart");
          break;
        case "changePassword":
          navigation.navigate("Auth", { screen: "Change Password" });
          break;
        case "logout":
          handleLogout();
          break;
        case "resendOtp":
          handleResendAndNavigate();
          break;
        case "profile":
          handleProfileOption();
          break;
        default:
          break;
      }
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah anda yakin ingin keluar?", [
      {
        text: "Batal",
        onPress: () => {},
      },
      {
        text: "Ya",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          setUserLogin(false);
          setUserImage(null);
        },
      },
    ]);
  };

  const handleResendAndNavigate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const data = {
        token: token,
      };
      const response = await axios.post(OTP_URI, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        Alert.alert(
          "OTP Terkirim Ulang",
          "OTP telah dikirim ulang ke email anda",
          [
            {
              text: "Ok",
              onPress: () => {
                navigation.navigate("Auth", { screen: "Otp" });
              },
            },
          ]
        );
      } else {
        Alert.alert("OTP Resent Failed", response.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleProfileOption = () => {
    if (userData && userData.name && userData.phone && userData.address) {
      navigation.navigate("Edit", { screen: "Edit Profile" });
    } else {
      navigation.navigate("Edit", { screen: "Edit Profile" });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      handleCheckUserLogin();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={{ width: "100%" }}>
        <Image
          source={require("../assets/images/wicker-baskets.jpg")}
          style={styles.cover}
        />
      </View>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          onPress={
            userLogin
              ? userData && userData.is_verified
                ? handlePickImage
                : () =>
                    Alert.alert(
                      "Akun anda belum terverifikasi",
                      "Silahkan verifikasi akun anda terlebih dahulu."
                    )
              : () =>
                  Alert.alert(
                    "Belum login",
                    "Login terlebih dahulu untuk mengubah foto profil anda!"
                  )
          }
        >
          <Image
            source={userImage ? { uri: userImage } : DEFAULT_AVATAR}
            style={styles.profile}
          />
          <MaterialCommunityIcons
            name="camera"
            size={24}
            color={COLORS.primary}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
        <Text style={styles.name}>
          {userLogin === true
            ? ""
            : "Tolong login terlebih dahulu ke akun anda!"}
        </Text>
        {userLogin === false ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("Auth", { screen: "Login" })}
          >
            <View style={styles.loginBtn}>
              <Text style={styles.menuText}>M A S U K {"    "}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.loginBtn}>
            {/* <Text style={styles.menuText}>
                {userData && userData.is_verified
                  ? userData.email
                  : "U N V E R I F I E D"}
                {"        "}
              </Text> */}
            {/* <Text style={styles.menuText}>
              {userLogin === false
                ? "Tolong login terlebih dahulu ke akun anda!"
                : userData && userData.is_verified
                ? userData.name && userData.phone
                  ? `${userData.name} - ${userData.email}`
                  : userData.email
                : "U N V E R I F I E D"}
              {"      "}
            </Text> */}
            <Text style={styles.menuText}>
              {userLogin === false
                ? "Tolong login terlebih dahulu ke akun anda!"
                : userData && userData.is_verified
                ? userData.name && !userData.phone
                  ? `${userData.name} - ${userData.email}`
                  : userData.name && userData.phone
                  ? `${userData.name} (${userData.phone}) - ${userData.email}`
                  : userData.email
                : "U N V E R I F I E D"}
              {"      "}
            </Text>
          </View>
        )}
        <ScrollView
          style={{ flex: 1, marginBottom: 85 }}
          showsVerticalScrollIndicator={false}
        >
          {userLogin === false ? (
            <View></View>
          ) : (
            <View style={styles.menuWrapper}>
              {!userData ||
                (!userData.is_verified && (
                  <TouchableOpacity
                    onPress={() => handleOptionClick("resendOtp")}
                  >
                    <View style={styles.menuItem(0.2)}>
                      <AntDesign
                        name="reload1"
                        size={24}
                        color={COLORS.primary}
                      />
                      <Text style={styles.menuText}>Resend OTP</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              <TouchableOpacity onPress={() => handleOptionClick("favorite")}>
                <View style={styles.menuItem(0.2)}>
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuText}>Favorit</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionClick("order")}>
                <View style={styles.menuItem(0.2)}>
                  <MaterialCommunityIcons
                    name="truck-delivery-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuText}>Order</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionClick("cart")}>
                <View style={styles.menuItem(0.2)}>
                  <SimpleLineIcons
                    name="bag"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuText}>Cart</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleOptionClick("changePassword");
                }}
              >
                <View style={styles.menuItem(0.2)}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuText}>Ubah Password</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionClick("logout")}>
                <View style={styles.menuItem(0.2)}>
                  <AntDesign name="logout" size={24} color={COLORS.primary} />
                  <Text style={styles.menuText}>Keluar</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionClick("profile")}>
                <View style={styles.menuItem(0.2)}>
                  <AntDesign name="user" size={24} color={COLORS.primary} />
                  <Text style={styles.menuText}>
                    {userData &&
                    userData.name &&
                    userData.phone &&
                    userData.address
                      ? "Edit Profile"
                      : "Lengkapi Data Profile"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
