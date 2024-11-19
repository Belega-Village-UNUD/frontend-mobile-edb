import React from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button"; // Adjust the path as necessary

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Dapatkan furnitur bambu terbaik dari Belega
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>
          Marketplace furnitur dengan harga paling kompetitif dari Desa Belega
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/Onboarding/belega-logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={() => navigation.replace("Bottom Navigation")}
          isValid={true}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "300",
    marginVertical: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: viewportWidth * 0.6,
    height: viewportHeight * 0.3,
    resizeMode: "contain",
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
  },
});

export default OnboardingScreen;
