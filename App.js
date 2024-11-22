import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { CartProvider } from "./src/provider/CartProvider";
import AuthNavigation from "./src/navigation/AuthNavigation";
import BottomTabNavigation from "./src/navigation/BottomTabNavigation";
import ProfileNavigation from "./src/navigation/ProfileNavigation";
import SplashNavigation from "./src/navigation/SplashNavigation";
import { LogBox } from "react-native";
import {
  CartScreen,
  ProductDetailsScreen,
  ProductScreen,
  SellerTransactionScreen,
  OrderScreen,
  TransactionDetailScreen,
  OrderDetailScreen,
  CalculationShippingScreen,
  StoreProductsScreen,
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

  LogBox.ignoreLogs([
    "ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes, migrate to the 'deprecated-react-native-prop-types' package.",
  ]);
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <CartProvider>
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
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
          />
          <Stack.Screen name="StoreProducts" component={StoreProductsScreen} />
          <Stack.Screen name="ProductList" component={ProductScreen} />
          <Stack.Screen name="OrderNav" component={OrderScreen} />
          <Stack.Screen
            name="TransactionNav"
            component={SellerTransactionScreen}
          />
          <Stack.Screen
            name="TransactionDetail"
            component={TransactionDetailScreen}
          />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen
            name="CalculationShipping"
            component={CalculationShippingScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
