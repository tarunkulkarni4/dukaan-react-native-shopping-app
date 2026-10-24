import { useEffect } from "react";
import { Stack } from "expo-router";
import {
    useFonts,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import * as ExpoSplashScreen from "expo-splash-screen";
import { CartProvider } from "../context/CartContext";

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Outfit_400Regular,
        Outfit_500Medium,
        Outfit_600SemiBold,
        Outfit_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            ExpoSplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <CartProvider>
            <Stack initialRouteName="index">
                <Stack.Screen name="products" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="cart" options={{ title: "Shopping Cart" }} />
                <Stack.Screen
                    name="product/[id]"
                    options={{ title: "Product Details" }}
                />
            </Stack>
        </CartProvider>
    );
}