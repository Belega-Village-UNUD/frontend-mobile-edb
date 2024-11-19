import React from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import Carousel from "react-native-snap-carousel";
import pic1 from "../../assets/Carousel/pic1.jpg";
import pic2 from "../../assets/Carousel/pic2.jpg";
import pic3 from "../../assets/Carousel/pic3.jpg";

const { width: viewportWidth } = Dimensions.get("window");

export default function CustomCarousel() {
  const slides = [pic1, pic2, pic3];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item} style={styles.image} />
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        data={slides}
        renderItem={renderItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth * 0.8}
        loop
        autoplay
        autoplayInterval={3000}
        inactiveSlideScale={0.94}
        inactiveSlideOpacity={0.7}
        containerCustomStyle={styles.carousel}
        contentContainerCustomStyle={styles.carouselContent}
        scrollEnabled={false} // Disable user interaction
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    alignItems: "center",
  },
  slide: {
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 15,
  },
  carousel: {
    marginTop: 15,
  },
  carouselContent: {
    alignItems: "center",
  },
});
