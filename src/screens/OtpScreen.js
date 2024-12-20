import { BASE_URI } from "@env";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { Formik } from "formik";
import moment from "moment/moment";
import React, { useRef, useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import { Button } from "../components";
import { COLORS, SIZES } from "../constants/theme";
import styles from "./styles/verif.style";

Yup.addMethod(Yup.string, "otpValidation", function () {
  return this.test({
    name: "otpValidation",
    test: (value) => /^[a-zA-Z0-9]{4}$/.test(value),
    message: "OTP tidak valid",
  });
});

const OTP_URI = BASE_URI + "/api/auth/otp";
const OTP_VERIFY_URI = BASE_URI + "/api/auth/otp/verify";

const validationSchema = Yup.object().shape({
  otp: Yup.string().required("Formulir OTP tidak boleh kosong").otpValidation(),
});

export default function OtpScreen({ navigation }) {
  const [loader, setLoader] = useState(false);
  const [startTime, setStartTime] = useState(moment());
  const [values, setValues] = useState({ otp: "" });
  const [resendTimeout, setResendTimeout] = useState(60);
  const countdownInterval = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      countdownInterval.current = setInterval(() => {
        setResendTimeout((prevTimeout) => {
          if (prevTimeout <= 1) {
            clearInterval(countdownInterval.current);
            handleResendOtp();
            Alert.alert(
              "Tolong isi form OTP ini",
              "Kode OTP telah dikirim ulang karena form tidak diisi dalam 3 menit"
            );
            return 60;
          } else {
            return prevTimeout - 1;
          }
        });
      }, 1000);

      return () => {
        clearInterval(countdownInterval.current);
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      setStartTime(moment()); // Reset the start time when the form values change
      return () => {};
    }, [values])
  );

  const inValidForm = () => {
    Alert.alert(
      "Formulir Tidak Valid",
      "Tolong lengkapi formulir dengan benar",
      [
        {
          text: "Lanjutkan",
          onPress: () => console.log("Lanjutkan Ditekan"),
        },
      ]
    );
  };

  const handleChange = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  const handleResendOtp = async () => {
    if (resendTimeout < 60) {
      Alert.alert(
        "Tunggu sebentar",
        `Anda dapat mengirim ulang OTP dalam ${resendTimeout} detik`
      );
      return;
    }
    try {
      // const endpoint =
      //     'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/otp'; // Replace with your API endpoint
      const token =
        (await AsyncStorage.getItem("token")) ||
        (await AsyncStorage.getItem("tokenForgot"));
      const data = {
        token: token,
      };
      const response = await axios.post(OTP_URI, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        Alert.alert("OTP Resent", "A new OTP has been sent to your email", [
          {
            text: "Ok",
            onPress: () => {},
          },
        ]);
      }
      setResendTimeout(60);
      countdownInterval.current = setInterval(() => {
        setResendTimeout((prevTimeout) => {
          if (prevTimeout <= 1) {
            clearInterval(countdownInterval.current);
            return 60;
          } else {
            return prevTimeout - 1;
          }
        });
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSendOtp = async (values) => {
    setLoader(true);
    try {
      let token = await AsyncStorage.getItem("token");
      let isVerify = await AsyncStorage.getItem("tokenForgot");
      let authToken;
      if (token) {
        authToken = token;
        AsyncStorage.removeItem("tokenForgot");
      } else {
        authToken = isVerify;
        AsyncStorage.removeItem("token");
      }
      //   const endpoint =
      //     "https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/otp/verify";
      const data = values;
      console.log(token);
      console.log(isVerify);
      const response = await axios.post(OTP_VERIFY_URI, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.status === 200) {
        Alert.alert("Verifikasi Berhasil", response.data.message, [
          {
            text: "Lanjutkan",
            onPress: () => {
              if (authToken === isVerify) {
                navigation.navigate("Auth", {
                  screen: "Reset Password",
                });
              } else if (authToken === token) {
                navigation.navigate("Bottom Navigation", {
                  screen: "Home",
                });
              } else {
                navigation.navigate("Auth", {
                  screen: "Login",
                });
              }
            },
          },
        ]);
      }
    } catch (e) {
      setLoader(false);
      Alert.alert("Verifikasi Gagal", "Kode OTP tidak valid", [
        {
          text: "Ok",
          onPress: () => console.log(e),
        },
      ]);
    } finally {
      setLoader(false);
    }
  };

  return (
    <ScrollView
      style={{ marginHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topHalf}>
        <View style={styles.iconBg}>
          <View style={styles.iconVerif}>
            <Ionicons
              name="lock-closed-outline"
              size={SIZES.xxLarge + 80}
              color={COLORS.primary}
            />
          </View>
        </View>
      </View>
      <View style={styles.bottomHalf}>
        <Text style={styles.pageTitle}>Verifikasi OTP</Text>
        <Text style={styles.pageDesc}>
          Tolong verifikasi akun anda menggunakan otp yang terkirim ke email
          anda
        </Text>
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSendOtp(values)}
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
            resetForm,
          }) => (
            <View>
              <View style={styles.wrapper}>
                <View
                  style={styles.inputWrapper(
                    touched.otp ? COLORS.primary : COLORS.offwhite
                  )}
                >
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color={COLORS.gray3}
                    style={styles.iconStyle}
                  />
                  <TextInput
                    placeholder="Kode OTP"
                    onFocus={() => {
                      setFieldTouched("otp");
                    }}
                    onBlur={() => {
                      setFieldTouched("otp", "");
                    }}
                    value={values.otp}
                    onChangeText={handleChange("otp")}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={4}
                    style={{ flex: 1 }}
                  />
                </View>
                {touched.otp && errors.otp && (
                  <Text style={styles.errorMessage}>{errors.otp}</Text>
                )}
              </View>
              <View style={{ marginTop: -15 }}>
                <Button
                  loader={loader}
                  title={"V E R I F I K A S I"}
                  onPress={isValid ? handleSubmit : inValidForm}
                  isValid={isValid}
                />
                <Text style={styles.resendOtp}>
                  Belum dapat OTP?{" "}
                  <Text
                    onPress={() => handleResendOtp()}
                    style={{
                      color: COLORS.primary,
                      textDecorationLine: "underline",
                    }}
                  >
                    {resendTimeout < 60
                      ? `Resend in ${resendTimeout} seconds`
                      : "Resend"}
                  </Text>
                </Text>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}
