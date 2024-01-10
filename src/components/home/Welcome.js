import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants/theme";
import styles from "./welcome.style";

export default function Welcome() {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.welcomeTxt(COLORS.gray3, SIZES.xSmall - 40)}>
          Temukan Furnitur yang{" "}
          <Text style={styles.welcomeTxt(COLORS.primary, 0)}>Sesuai Kamu!</Text>
        </Text>
      </View>
      <View style={styles.searchContainer}>
        <TouchableOpacity>
          <Feather name="search" size={24} style={styles.searchIcon} />
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            onPressIn={() => navigation.navigate("Search")}
            placeholder="Apa yang sedang kamu cari?"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
