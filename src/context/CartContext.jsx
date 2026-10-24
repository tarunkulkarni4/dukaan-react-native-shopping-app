import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_STORAGE_KEY = "dukaan_cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load saved cart items from AsyncStorage on initial mount
    useEffect(() => {
        let isMounted = true;

        const loadSavedCart = async () => {
            try {
                const savedData = await AsyncStorage.getItem(CART_STORAGE_KEY);
                if (savedData !== null) {
                    const parsed = JSON.parse(savedData);
                    if (Array.isArray(parsed) && isMounted) {
                        setCartItems(parsed);
                    }
                }
            } catch (error) {
                console.error("Failed to load cart from AsyncStorage:", error);
            } finally {
                if (isMounted) {
                    setIsHydrated(true);
                }
            }
        };

        loadSavedCart();

        return () => {
            isMounted = false;
        };
    }, []);

    // Automatically persist cart items to AsyncStorage whenever cartItems change,
    // only after initial hydration has completed to avoid overwriting saved data.
    useEffect(() => {
        if (!isHydrated) return;

        const saveCart = async () => {
            try {
                await AsyncStorage.setItem(
                    CART_STORAGE_KEY,
                    JSON.stringify(cartItems)
                );
            } catch (error) {
                console.error("Failed to save cart to AsyncStorage:", error);
            }
        };

        saveCart();
    }, [cartItems, isHydrated]);

    // Add product to cart
    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingProduct = prevItems.find(
                (item) => item.id === product.id
            );

            if (existingProduct) {
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, { ...product, quantity }];
        });
    };

    // Increase quantity
    const increaseQuantity = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // Decrease quantity
    const decreaseQuantity = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    // Remove product
    const removeFromCart = (id) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== id)
        );
    };

    // Clear cart
    const clearCart = async () => {
        setCartItems([]);
        try {
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
        } catch (error) {
            console.error("Failed to clear cart in AsyncStorage:", error);
        }
    };

    // Calculate subtotal
    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // Total number of items
    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
                subtotal,
                cartCount,
                isHydrated,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
}