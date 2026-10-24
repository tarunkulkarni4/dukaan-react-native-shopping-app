import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Pressable,
    Animated,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { getProductById } from "../../services/productApi";
import { COLORS } from "../../constants/theme";
import { useCart } from "../../context/CartContext";
import { formatUSDToINR } from "../../utils/currency";
// Shopping Bag Icon
function ShoppingBagIcon({ size = 19, color = "#FFFFFF" }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <Path d="M3 6h18" />
            <Path d="M16 10a4 4 0 0 1-8 0" />
        </Svg>
    );
}

// Checkmark Icon
function CheckIcon({ size = 16, color = "#FFFFFF" }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Path d="M20 6L9 17l-5-5" />
        </Svg>
    );
}

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();

    const insets = useSafeAreaInsets();
    // Access shared cart function
    const { addToCart } = useCart();

    // Product states
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Quantity state
    const [quantity, setQuantity] = useState(1);

    // Button animation
    const buttonScale = useRef(new Animated.Value(1)).current;

    // Toast animation & timer
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const toastTranslateY = useRef(new Animated.Value(14)).current;
    const toastTimer = useRef(null);

    // Cleanup toast timer on unmount
    useEffect(() => {
        return () => {
            if (toastTimer.current) {
                clearTimeout(toastTimer.current);
            }
        };
    }, []);

    // Increase quantity
    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    // Decrease quantity
    const decreaseQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    // Button press animation
    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    // ADD TO CART FUNCTION
    const handleAddToCart = () => {
        if (!product) return;

        // Store product in CartContext
        addToCart(product, quantity);

        // Reset timer if already active to avoid stacking/premature dismissal
        if (toastTimer.current) {
            clearTimeout(toastTimer.current);
        }

        // Stop any running animations
        toastOpacity.stopAnimation();
        toastTranslateY.stopAnimation();

        // Animate slide-up and fade-in
        Animated.parallel([
            Animated.timing(toastOpacity, {
                toValue: 1,
                duration: 220,
                useNativeDriver: true,
            }),
            Animated.timing(toastTranslateY, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start();

        // Automatically dismiss after 2 seconds with slide-down and fade-out
        toastTimer.current = setTimeout(() => {
            Animated.parallel([
                Animated.timing(toastOpacity, {
                    toValue: 0,
                    duration: 260,
                    useNativeDriver: true,
                }),
                Animated.timing(toastTranslateY, {
                    toValue: 14,
                    duration: 260,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 2000);
    };

    // Fetch product details
    useEffect(() => {
        let active = true;

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            setProduct(null);

            try {
                const data = await getProductById(id);

                if (active) {
                    if (!data || !data.id) {
                        throw new Error("Product not found");
                    }

                    setProduct(data);
                }
            } catch (err) {
                if (active) {
                    setError("Unable to load product details");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchProduct();

        return () => {
            active = false;
        };
    }, [id]);

    // Loading screen
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                />

                <Text style={styles.loadingMessage}>
                    Loading product...
                </Text>
            </View>
        );
    }

    // Error screen
    if (error || !product) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorMessage}>
                    {error || "Product not found"}
                </Text>
            </View>
        );
    }

    // Dynamic total price
    const totalPrice = (
        product.price * quantity
    ).toFixed(2);

    return (
        <View style={styles.screenContainer}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.image }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Product Information */}
                <View style={styles.content}>
                    <Text style={styles.category}>
                        {product.category}
                    </Text>

                    <Text style={styles.title}>
                        {product.title}
                    </Text>

                    <Text style={styles.price}>
                        {formatUSDToINR(product.price)}
                    </Text>

                    <Text style={styles.rating}>
                        ⭐ {product.rating?.rate ?? "N/A"} / 5
                        {"  "}({product.rating?.count ?? 0} reviews)
                    </Text>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>
                        Description
                    </Text>

                    <Text style={styles.description}>
                        {product.description}
                    </Text>

                    {/* Quantity Selector */}
                    <View style={styles.quantitySection}>
                        <Text style={styles.quantityLabel}>
                            Quantity
                        </Text>

                        <View style={styles.quantityControls}>
                            {/* Decrease */}
                            <Pressable
                                style={styles.quantityButton}
                                onPress={decreaseQuantity}
                            >
                                <Text style={styles.quantityButtonText}>
                                    −
                                </Text>
                            </Pressable>

                            {/* Quantity */}
                            <Text style={styles.quantityValue}>
                                {quantity}
                            </Text>

                            {/* Increase */}
                            <Pressable
                                style={styles.quantityButton}
                                onPress={increaseQuantity}
                            >
                                <Text style={styles.quantityButtonText}>
                                    +
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Add to Cart Button */}
            <View
                style={[
                    styles.bottomBar,
                    {
                        paddingBottom: Math.max(
                            insets.bottom,
                            16
                        ),
                    },
                ]}
            >
                <Animated.View
                    style={{
                        transform: [{ scale: buttonScale }],
                    }}
                >
                    <Pressable
                        style={({ pressed }) => [
                            styles.addToCartButton,
                            pressed && styles.addToCartButtonPressed,
                        ]}
                        onPress={handleAddToCart}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        disabled={loading || !product}
                    >
                        <ShoppingBagIcon
                            size={19}
                            color="#FFFFFF"
                        />

                        <Text style={styles.addToCartText}>
                            Add to Cart · {formatUSDToINR(product.price * quantity)}
                        </Text>
                    </Pressable>
                </Animated.View>
            </View>

            {/* Floating Toast Notification */}
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.toastWrapper,
                    {
                        bottom: Math.max(insets.bottom, 16) + 74,
                        opacity: toastOpacity,
                        transform: [{ translateY: toastTranslateY }],
                    },
                ]}
            >
                <View style={styles.toast}>
                    <CheckIcon size={16} color="#FFFFFF" />
                    <Text style={styles.toastText}>Added to cart</Text>
                </View>
            </Animated.View>
        </View>
    );
}

// STYLES
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 28,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },

    loadingMessage: {
        fontFamily: "Outfit_400Regular",
        fontSize: 15,
        color: COLORS.secondaryText,
        marginTop: 12,
    },

    errorMessage: {
        fontFamily: "Outfit_500Medium",
        fontSize: 15,
        color: COLORS.error,
    },

    imageContainer: {
        backgroundColor: COLORS.surface,
        padding: 30,
        alignItems: "center",
    },

    image: {
        width: "100%",
        height: 280,
    },

    content: {
        padding: 22,
    },

    category: {
        fontFamily: "Outfit_500Medium",
        color: COLORS.secondaryText,
        fontSize: 13,
        textTransform: "uppercase",
    },

    title: {
        fontFamily: "Outfit_700Bold",
        fontSize: 25,
        color: COLORS.text,
        marginTop: 12,
    },

    price: {
        fontFamily: "Outfit_700Bold",
        fontSize: 27,
        color: COLORS.primary,
        marginTop: 15,
    },

    rating: {
        fontFamily: "Outfit_500Medium",
        fontSize: 14,
        color: COLORS.text,
        marginTop: 12,
    },

    sectionTitle: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 19,
        color: COLORS.text,
        marginTop: 30,
    },

    description: {
        fontFamily: "Outfit_400Regular",
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.secondaryText,
        marginTop: 10,
    },

    quantitySection: {
        marginTop: 30,
    },

    quantityLabel: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 18,
        color: COLORS.text,
        marginBottom: 15,
    },

    quantityControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },

    quantityButton: {
        width: 44,
        height: 44,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    quantityButtonText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 24,
        color: COLORS.primary,
    },

    quantityValue: {
        fontFamily: "Outfit_700Bold",
        fontSize: 20,
        color: COLORS.text,
        minWidth: 25,
        textAlign: "center",
    },

    bottomBar: {
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingHorizontal: 16,
        paddingTop: 12,
    },

    addToCartButton: {
        backgroundColor: COLORS.primary,
        height: 54,
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    addToCartButtonPressed: {
        opacity: 0.92,
    },

    addToCartText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
        letterSpacing: 0.3,
        marginLeft: 10,
    },

    toastWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 999,
    },

    toast: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 6,
    },

    toastText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
        marginLeft: 8,
        letterSpacing: 0.2,
    },
});