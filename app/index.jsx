import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import Colors from "../constants/Colors";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.WHITE }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/Welcome" />;
}
