// import React from "react";
// import { ActivityIndicator, FlatList, View } from "react-native";
// import { COLORS, SIZES } from "../../constants/theme";
// import ProductCardView from "./ProductCardView";

// const ProductRow = () => {
//   const products = [1, 2, 3, 4, 5, 6];
//   return (
//     <View style={{ marginTop: SIZES.xSmall / 2, marginLeft: 18 }}>
//       {/* {isLoading ? (
//         <ActivityIndicator size={SIZES.large} color={COLORS.primary} />
//       ) : error ? (
//         <Text>Gagal menampilkan produk, silahkan periksa koneksi anda!</Text>
//       ) : ( */}
//       <FlatList
//         data={products}
//         renderItem={({ item }) => <ProductCardView />}
//         horizontal
//         contentContainerStyle={{ columnGap: SIZES.medium }}
//       />
//       {/* )} */}
//     </View>
//   );
// };

// export default ProductRow;

// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, FlatList, View, Text } from "react-native";
// import { COLORS, SIZES } from "../../constants/theme";
// import ProductCardView from "./ProductCardView";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { BASE_URI } from "@env";
// import axios from "axios";

// const ALL_PRODUCT_URI = BASE_URI + "/api/products/all";

// const ProductRow = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const handleGetAllProducts = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.get(ALL_PRODUCT_URI, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setData(response.data.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.log(error);
//       setError(error.message);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     handleGetAllProducts();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={{ marginTop: SIZES.xSmall / 2, marginLeft: 18 }}>
//         <ActivityIndicator size={SIZES.large} color={COLORS.primary} />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={{ marginTop: SIZES.xSmall / 2, marginLeft: 18 }}>
//         <Text>Gagal menampilkan produk, silahkan periksa koneksi anda!</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ marginTop: SIZES.xSmall / 2, marginLeft: 18 }}>
//       <FlatList
//         data={data}
//         renderItem={({ item }) => <ProductCardView item={item} />}
//         horizontal
//         contentContainerStyle={{ columnGap: SIZES.medium }}
//       />
//     </View>
//   );
// };

// export default ProductRow;

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import ProductCardView from "./ProductCardView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URI } from "@env";
import styles from "./productRow.style";
import axios from "axios";

const ALL_PRODUCT_URI = BASE_URI + "/api/products/all";

const ProductRow = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGetAllProducts = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(ALL_PRODUCT_URI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size={SIZES.large} color={COLORS.primary} />
      ) : error ? (
        <>
          <Text>
            Gagal menampilkan produk, silahkan periksa koneksi anda!{" "}
            <TouchableOpacity onPress={handleGetAllProducts}>
              <Text style={styles.refreshLink}>Segarkan</Text>
            </TouchableOpacity>
          </Text>
        </>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <ProductCardView item={item} />}
          horizontal
          contentContainerStyle={{ columnGap: SIZES.medium }}
        />
      )}
    </View>
  );
};

export default ProductRow;
