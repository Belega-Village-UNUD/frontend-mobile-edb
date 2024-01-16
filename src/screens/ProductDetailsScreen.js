import { Ionicons, SimpleLineIcons, Fontisto } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS } from "../constants/theme";
import styles from "./styles/productDetails.style";
import { ScrollView } from "react-native-gesture-handler";

const ProductDetailsScreen = ({ navigation }) => {
  const [count, setCount] = useState(1);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const images = [
    "https://d326fntlu7tb1e.cloudfront.net/uploads/cb2e64a8-ad4c-4d45-b58b-b0c7e11b6bb4-fn1.jpg",
    "https://d326fntlu7tb1e.cloudfront.net/uploads/b1f6d96d-3297-4270-ba65-657dc2bc0236-fn2.jpg",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.upperRow}>
        {/* <BackBtn onPress={() => navigation.goBack()} /> */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="heart" size={30} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {/* <Image
        source={{
          uri: "https://d326fntlu7tb1e.cloudfront.net/uploads/cb2e64a8-ad4c-4d45-b58b-b0c7e11b6bb4-fn1.jpg",
        }}
        style={styles.image}
      /> */}
      <SliderBox
        images={images}
        style={styles.image}
        dotColor={COLORS.primary}
        inactiveDot={COLORS.secondary}
        ImageComponentStyle={{
          borderRadius: 15,
          width: "90%",
          marginTop: 15,
        }}
        autoplay
        circleLoop
        autoplayInterval={3000}
      />
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Product</Text>
          <View style={styles.priceWrapper}>
            <Text style={styles.price}>Rp. 100.000</Text>
          </View>
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.rating}>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Ionicons key={index} name="star" size={24} color="gold" />
            ))}
            <Text style={styles.ratingText}>
              {"  "}(4.5){"  "}
            </Text>
          </View>
          <View style={styles.rating}>
            <TouchableOpacity onPress={() => handleIncrement()}>
              <SimpleLineIcons name="plus" size={20} />
            </TouchableOpacity>
            <Text style={styles.ratingText}>
              {"   "}
              {count}
              {"   "}
            </Text>
            <TouchableOpacity onPress={() => handleDecrement()}>
              <SimpleLineIcons name="minus" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.description}>Description</Text>
          <ScrollView
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.descriptionText}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Veritatis nisi quod dicta expedita consequuntur sit explicabo.
              Numquam voluptatem sequi quia dignissimos culpa? Doloribus
              consequuntur voluptate facere, dolores perspiciatis ratione
              minima!
            </Text>
          </ScrollView>
        </View>
        <View style={styles.cartRow}>
          <TouchableOpacity onPress={() => {}} style={styles.cartBtn}>
            <Text style={styles.cartTitle}>Buy Now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.addCart}>
            <Fontisto name="shopping-bag" size={24} color={COLORS.lightWhite} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.sellerChat}>
            <Fontisto name="whatsapp" size={24} color={COLORS.lightWhite} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;
