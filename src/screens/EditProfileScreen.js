import { BASE_URI } from "@env";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import { Button } from "../components";
import { COLORS } from "../constants/theme";
import styles from "./styles/profile.style";
import { Picker } from "@react-native-picker/picker";

const PROFILE_URI = BASE_URI + "/api/profiles";
const PROVINCE_URI = BASE_URI + "/api/shipping/province";
const CITY_URI = BASE_URI + "/api/shipping/city";
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
  const [userProvince, setUserProvince] = useState("");
  const [userCity, setUserCity] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

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
      const response = await fetch(PROFILE_URI, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (responseData.success) {
        setUserName(responseData.data.profile.name);
        setUserPhone(responseData.data.profile.phone);
        setUserImage(responseData.data.profile.avatar_link);
        setUserAddress(responseData.data.profile.address);
        setUserProvince(responseData.data.profile.province.province);
        setUserCity(responseData.data.profile.city.city_name);
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
        city_id: userCity,
      };
      const response = await fetch(PROFILE_URI, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setLoader(false);
        navigation.navigate("Profile");
        console.log(values);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGetProvince = async () => {
    let token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(PROVINCE_URI, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.log(`Failed to fetch provinces: ${response.status}`);
        return;
      } else {
        const responseData = await response.json();
        setProvinces(responseData.data); // Update to set the provinces list
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGetCity = async (provinceId) => {
    let token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${CITY_URI}?province_id=${provinceId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.log(`Failed to fetch cities: ${response.status}`);
        return;
      } else {
        const responseData = await response.json();
        setCities(responseData.data); // Update to set the cities list
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      handleGetProfile();
      handleGetProvince();
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

              <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                <View style={styles.inputWrapper}>
                  <Picker
                    selectedValue={userProvince}
                    onValueChange={(itemValue, itemIndex) => {
                      setUserProvince(itemValue);
                      handleGetCity(itemValue);
                    }}
                  >
                    {/* Placeholder for Province Picker */}
                    <Picker.Item
                      label={userProvince ? userProvince : "Provinsi Asal"}
                      value={undefined}
                    />
                    {provinces.map((province) => (
                      <Picker.Item
                        key={province.province_id}
                        label={province.province}
                        value={province.province_id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                <Picker
                  selectedValue={userCity}
                  onValueChange={(itemValue, itemIndex) =>
                    setUserCity(itemValue)
                  }
                >
                  {/* Placeholder for City Picker */}
                  <Picker.Item
                    label={userCity ? userCity : "Kota asal"}
                    value={undefined}
                  />
                  {cities.map((city) => (
                    <Picker.Item
                      key={city.city_id}
                      label={city.city_name}
                      value={city.city_id}
                    />
                  ))}
                </Picker>
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
