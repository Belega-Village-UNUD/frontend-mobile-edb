import { BASE_URI } from "@env";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { BackBtn, Button } from "../components";
import { COLORS } from "../constants/theme";
import styles from "./styles/login.style";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password terlalu pendek")
    .required("Password tidak boleh kosong"),
  // .matches(
  //   /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
  //   "Password harus memiliki setidaknya satu simbol unik"
  // ),

  email: Yup.string()
    .email("Email tidak valid")
    .required("Email tidak boleh kosong")
    .matches(/\S+@\S+\.\S+/, "Email tidak valid"),
});

const LOGIN_URI = BASE_URI + "/api/auth/login";

export default function LoginScreen({ navigation }) {
  const [loader, setLoader] = useState(false);
  const [obsecureText, setObsecureText] = useState(false);

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

  const handleSetUserLogin = async (values) => {
    setLoader(true);
    try {
      const data = values;
      const response = await fetch(LOGIN_URI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.status == 200) {
        setLoader(false);
        await AsyncStorage.setItem("token", responseData.data.token);
        navigation.navigate("Bottom Navigation", { screen: "Home" });
      } else {
        setLoader(false);
        Alert.alert("Error", responseData.message, [
          {
            text: "Ok",
            onPress: () => {},
          },
        ]);
      }
    } catch (error) {
      {
        // console.log(error);
        Alert.alert("Error Login", "Masukkan Kredensial yang Benar", [
          {
            text: "Ok",
            onPress: () => {},
          },
        ]);
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ marginHorizontal: 20 }}>
        <View>
          <BackBtn onPress={() => navigation.goBack()} />
          <Image
            source={require("../assets/images/bk.png")}
            style={styles.cover}
          />
          <Text style={styles.title}>Temukan Furnitur Kamu!</Text>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSetUserLogin(values)}
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
              <View>
                <View style={styles.wrapper}>
                  <View
                    style={styles.inputWrapper(
                      touched.email ? COLORS.primary : COLORS.offwhite
                    )}
                  >
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={20}
                      color={COLORS.gray3}
                      style={styles.iconStyle}
                    />
                    <TextInput
                      placeholder="Email"
                      onFocus={() => {
                        setFieldTouched("email");
                      }}
                      onBlur={() => {
                        setFieldTouched("email", "");
                      }}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorMessage}>{errors.email}</Text>
                  )}
                </View>
                <View style={styles.wrapper}>
                  <View
                    style={styles.inputWrapper(
                      touched.password ? COLORS.primary : COLORS.offwhite
                    )}
                  >
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={20}
                      color={COLORS.gray3}
                      style={styles.iconStyle}
                    />
                    <TextInput
                      secureTextEntry={obsecureText}
                      placeholder="Password"
                      onFocus={() => {
                        setFieldTouched("password");
                      }}
                      onBlur={() => {
                        setFieldTouched("password", "");
                      }}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                    <TouchableOpacity
                      onPress={() => setObsecureText(!obsecureText)}
                    >
                      <MaterialCommunityIcons
                        name={obsecureText ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={COLORS.gray3}
                        style={styles.iconStyle}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorMessage}>{errors.password}</Text>
                  )}
                </View>
                <View style={{ marginTop: -15 }}>
                  <Button
                    loader={loader}
                    title={"M A S U K"}
                    onPress={isValid ? handleSubmit : inValidForm}
                    isValid={isValid}
                  />
                  <View
                    style={{
                      marginTop: -25,
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.registration}>
                      Belum punya akun?{" "}
                      <Text
                        onPress={() =>
                          navigation.navigate("Auth", { screen: "Signup" })
                        }
                        style={{
                          color: COLORS.primary,
                          textDecorationLine: "underline",
                        }}
                      >
                        Daftar
                      </Text>
                      {"                  "}
                    </Text>
                    <Text
                      style={styles.forgotPassword}
                      onPress={() =>
                        navigation.navigate("Auth", {
                          screen: "Forgot Password",
                        })
                      }
                    >
                      Lupa Password?
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
