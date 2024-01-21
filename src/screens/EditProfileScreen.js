import { BASE_URI } from "@env";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import { Button } from "../components";
import { COLORS } from "../constants/theme";
import styles from "./styles/profile.style";

const PROFILE_URI = BASE_URI + "/api/profiles";
const DEFAULT_AVATAR = require("../assets/images/userDefault.png");

const validationSchema = Yup.object().shape({
  userName: Yup.string().matches(
    /^[a-zA-Z\s]*$/,
    "Nama hanya boleh berisi huruf dan spasi"
  ),
  userPhone: Yup.string().matches(
    /^\+62[0-9]*/,
    "Nomor harus diawali dengan +62"
  ),
  userAddress: Yup.string().matches(
    /^[a-zA-Z0-9.,\s]*$/,
    "Tidak boleh ada simbol selain titik dan koma"
  ),
});

export default function EditProfileScreen({ navigation }) {
  const [loader, setLoader] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  const inValidForm = () => {
    Alert.alert(
      "Formulir Tidak Valid",
      "Tolong lengkapi formulir dengan benar",
      [
        {
          text: "Lanjutkan",
          onPress: () => {},
        },
      ]
    );
  };

  const handleGetProfile = async () => {
    let token = await AsyncStorage.getItem("token");
    try {
      const response = await axios({
        method: "get",
        url: PROFILE_URI,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserName(response.data.data.profile.name);
        setUserPhone(response.data.data.profile.phone);
        setUserImage(response.data.data.profile.avatar_link);
        setUserAddress(response.data.data.profile.address);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleChangeProfile = async (values) => {
    setLoader(true);
    let token = await AsyncStorage.getItem("token");
    try {
      const data = {
        name: values.userName || userName,
        phone: values.userPhone || userPhone,
        address: values.userAddress || userAddress,
      };
      const response = await axios({
        method: "put",
        url: PROFILE_URI,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: data,
      });

      if (response.data.success) {
        setLoader(false);
        navigation.navigate("Profile");
        console.log(values);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      handleGetProfile();
    }, [])
  );

  return (
    <ScrollView>
      <StatusBar />
      <View style={{ width: "100%" }}>
        <Image
          source={require("../assets/images/wicker-baskets.jpg")}
          style={styles.cover}
        />
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={userImage ? { uri: userImage } : DEFAULT_AVATAR}
          style={styles.profile}
        />
      </View>
      <View>
        <Formik
          initialValues={{
            userName: "",
            userPhone: "",
            userAddress: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleChangeProfile(values)}
          validateOnMount
          validateOnChange
        >
          {({
            handleChange,
            handleBlur,
            touched,
            handleSubmit,
            values,
            errors,
            isValid,
            setFieldTouched,
          }) => (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={
                  (styles.wrapper, { marginHorizontal: 20, marginTop: 20 })
                }
              >
                <View
                  style={styles.inputWrapper(
                    touched.userName ? COLORS.primary : COLORS.offwhite
                  )}
                >
                  <MaterialCommunityIcons
                    name="account"
                    size={24}
                    color={COLORS.primary}
                    style={styles.iconStyle}
                  />
                  <TextInput
                    placeholder={userName ? userName : "Masukkan Nama Lengkap"}
                    style={{ flex: 1 }}
                    onFocus={() => {
                      setFieldTouched("userName");
                    }}
                    onChangeText={handleChange("userName")}
                    onBlur={() => setFieldTouched("userName", "")}
                    value={values.userName}
                    autoCapitalize="none"
                  />
                </View>
                {touched.userName && errors.userName && (
                  <Text style={styles.errorMessage}>{errors.userName}</Text>
                )}
              </View>
              <View
                style={
                  (styles.wrapper, { marginHorizontal: 20, marginTop: 20 })
                }
              >
                <View
                  style={styles.inputWrapper(
                    touched.userPhone ? COLORS.primary : COLORS.offwhite
                  )}
                >
                  <MaterialCommunityIcons
                    name="phone"
                    size={24}
                    color={COLORS.primary}
                    style={styles.iconStyle}
                  />
                  <TextInput
                    placeholder={
                      userPhone ? `(${userPhone})` : "(ex: +628123456789)"
                    }
                    onFocus={() => {
                      setFieldTouched("userPhone");
                    }}
                    style={{ flex: 1 }}
                    onChangeText={handleChange("userPhone")}
                    onBlur={() => setFieldTouched("userPhone", "")}
                    value={values.userPhone}
                    autoCapitalize="none"
                  />
                </View>
                {touched.userPhone && errors.userPhone && (
                  <Text style={styles.errorMessage}>{errors.userPhone}</Text>
                )}
              </View>
              <View
                style={
                  (styles.wrapper, { marginHorizontal: 20, marginTop: 20 })
                }
              >
                <View
                  style={styles.inputWrapper(
                    touched.userAddress ? COLORS.primary : COLORS.offwhite
                  )}
                >
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={24}
                    color={COLORS.primary}
                    style={styles.iconStyle}
                  />
                  <TextInput
                    placeholder={userAddress ? userAddress : "Alamat"}
                    style={{ flex: 1 }}
                    onFocus={() => {
                      setFieldTouched("userAddress");
                    }}
                    onChangeText={handleChange("userAddress")}
                    onBlur={() => setFieldTouched("userAddress", "")}
                    value={values.userAddress}
                    autoCapitalize="none"
                  />
                </View>
                {touched.userAddress && errors.userAddress && (
                  <Text style={styles.errorMessage}>{errors.userAddress}</Text>
                )}
              </View>
              <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Button
                  loader={loader}
                  title={"S I M P A N"}
                  onPress={isValid ? handleSubmit : inValidForm}
                  isValid={isValid}
                />
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}
