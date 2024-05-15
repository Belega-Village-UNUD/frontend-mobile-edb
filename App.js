import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import AuthNavigation from "./src/navigation/AuthNavigation";
import BottomTabNavigation from "./src/navigation/BottomTabNavigation";
import ProfileNavigation from "./src/navigation/ProfileNavigation";
import SplashNavigation from "./src/navigation/SplashNavigation";
import {
  CartScreen,
  ProductDetailsScreen,
  ProductScreen,
  SellerTransactionScreen,
  OrderScreen,
  ConfirmationScreen,
} from "./src/screens";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    regular: require("./src/assets/fonts/Poppins-Regular.ttf"),
    light: require("./src/assets/fonts/Poppins-Light.ttf"),
    bold: require("./src/assets/fonts/Poppins-Bold.ttf"),
    medium: require("./src/assets/fonts/Poppins-Medium.ttf"),
    extrabold: require("./src/assets/fonts/Poppins-ExtraBold.ttf"),
    semibold: require("./src/assets/fonts/Poppins-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashNavigation} />
        <Stack.Screen
          name="Bottom Navigation"
          component={BottomTabNavigation}
        />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Auth" component={AuthNavigation} />
        <Stack.Screen name="Edit" component={ProfileNavigation} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="ProductList" component={ProductScreen} />
        <Stack.Screen name="OrderNav" component={OrderScreen} />
        <Stack.Screen
          name="TransactionNav"
          component={SellerTransactionScreen}
        />
        <Stack.Screen
          name="ConfirmationScreen"
          component={ConfirmationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
