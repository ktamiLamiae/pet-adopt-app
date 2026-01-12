import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

import Colors from "../constants/Colors";

export default function RootLayout() {

  useFonts
    ({
      'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
      'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf'),
      'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
    });

  return (
    <AuthProvider>
      <Stack screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: Colors.WHITE
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, headerTitle: '' }} />
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
          options={{
            headerShown: true
          }}
        />
        <Stack.Screen name="user-post/index"
          options={{
            headerShown: true,
            headerTitle: 'My Posts'
          }}
        />
        <Stack.Screen name="admin/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="admin/pets"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="admin/users"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="admin/categories"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
