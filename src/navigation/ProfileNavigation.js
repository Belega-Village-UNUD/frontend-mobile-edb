import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EditProfileScreen } from "../screens";

export default function ProfileNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Edit Profile"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
