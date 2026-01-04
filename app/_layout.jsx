import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {

  useFonts
    ({
      'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
      'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf'),
      'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
    });

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Auth/login/index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="Auth/signup/index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="Welcome/index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="pet-details/index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="chat/index"
        // options={{
        //   headerShown: false
        // }}
        />
      </Stack>
    </AuthProvider>
  );
}
