import { useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    ScrollView,
    Pressable,
    StyleSheet,
    Modal,
    StatusBar,
} from "react-native";

import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle } from "react-native-svg";

import { useCart } from "../context/CartContext";
import { COLORS } from "../constants/theme";
import { formatUSDToINR } from "../utils/currency";

// Clean Professional SVG Icons
function CheckCircleIcon({ size = 76, color = COLORS.primary }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle
                cx="12"
                cy="12"
                r="10"
                fill="rgba(15, 61, 46, 0.08)"
                stroke={color}
                strokeWidth="1.8"
            />
            <Path
                d="M8 12.5L10.5 15L16 9.5"
                stroke={color}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

function CartEmptyIcon({ size = 48, color = COLORS.secondaryText }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Circle cx="9" cy="20" r="1.5" />
            <Circle cx="19" cy="20" r="1.5" />
            <Path d="M1 1h4l2.6 12.8a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 5H5.4" />
        </Svg>
    );
}

function ShieldCheckIcon({ size = 16, color = COLORS.primary }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <Path d="M9 12l2 2 4-4" />
        </Svg>
    );
}

export default function CartScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        cartCount,
    } = useCart();

    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderSummary, setOrderSummary] = useState(null);

    const handleOpenCheckout = () => {
        if (cartItems.length === 0) return;
        setCheckoutModalVisible(true);
    };

    const handlePlaceOrder = () => {
        // Capture snapshot of all products, quantities, and totals BEFORE clearing the cart
        const summary = {
            itemCount: cartCount,
            total: subtotal,
            items: cartItems.map((item) => ({ ...item })),
            date: new Date().toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            orderId: `DKN-${Math.floor(100000 + Math.random() * 900000)}`,
        };
        setOrderSummary(summary);
        setCheckoutModalVisible(false);
        clearCart();
        setOrderPlaced(true);
    };

    // Order Placed Success State
    if (orderPlaced) {
        return (
            <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
                <ScrollView
                    style={styles.successScrollView}
                    contentContainerStyle={[
                        styles.successScrollContent,
                        { paddingBottom: Math.max(insets.bottom, 24) + 20 },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.successIconWrapper}>
                        <CheckCircleIcon size={80} color={COLORS.primary} />
                    </View>

                    <Text style={styles.successTitle}>
                        Order Placed Successfully!
                    </Text>

                    <Text style={styles.successSubtitle}>
                        Thank you for shopping at Dukaan. Your simulated order has been confirmed.
                    </Text>

                    {/* Detailed Receipt Card */}
                    <View style={styles.receiptCard}>
                        <View style={styles.receiptHeader}>
                            <View>
                                <Text style={styles.receiptHeaderTitle}>Order Receipt</Text>
                                <Text style={styles.receiptOrderId}>
                                    ID: {orderSummary?.orderId ?? "DKN-100000"}
                                </Text>
                            </View>
                            <View style={styles.simulatedBadge}>
                                <Text style={styles.simulatedBadgeText}>SIMULATED</Text>
                            </View>
                        </View>

                        {/* List of Purchased Products in Receipt */}
                        <View style={styles.receiptItemsList}>
                            {orderSummary?.items?.map((item) => {
                                const lineTotalUSD = item.price * item.quantity;
                                return (
                                    <View key={item.id} style={styles.receiptItemRow}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.receiptItemThumb}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.receiptItemInfo}>
                                            <Text
                                                style={styles.receiptItemTitle}
                                                numberOfLines={1}
                                            >
                                                {item.title}
                                            </Text>
                                            <Text style={styles.receiptItemSub}>
                                                Qty: {item.quantity} · Unit: {formatUSDToINR(item.price)}
                                            </Text>
                                        </View>
                                        <Text style={styles.receiptItemLineTotal}>
                                            {formatUSDToINR(lineTotalUSD)}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.receiptDivider} />

                        {/* Totals Breakdown */}
                        <View style={styles.receiptRow}>
                            <Text style={styles.receiptLabel}>Total Items Purchased</Text>
                            <Text style={styles.receiptValue}>
                                {orderSummary?.itemCount ?? 0} {orderSummary?.itemCount === 1 ? "item" : "items"}
                            </Text>
                        </View>

                        <View style={styles.receiptRow}>
                            <Text style={styles.receiptLabel}>Subtotal</Text>
                            <Text style={styles.receiptValue}>
                                {formatUSDToINR(orderSummary?.total ?? 0)}
                            </Text>
                        </View>

                        <View style={styles.receiptRow}>
                            <Text style={styles.receiptLabel}>Delivery</Text>
                            <Text style={styles.receiptValueFree}>FREE</Text>
                        </View>

                        <View style={styles.receiptDivider} />

                        <View style={styles.receiptRow}>
                            <Text style={styles.receiptTotalLabel}>Grand Total</Text>
                            <Text style={styles.receiptTotalValue}>
                                {formatUSDToINR(orderSummary?.total ?? 0)}
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        style={styles.continueShoppingButton}
                        onPress={() => {
                            setOrderPlaced(false);
                            router.replace("/products");
                        }}
                    >
                        <Text style={styles.continueShoppingText}>
                            Continue Shopping
                        </Text>
                    </Pressable>
                </ScrollView>
            </View>
        );
    }

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
                <View style={styles.emptyIconCircle}>
                    <CartEmptyIcon size={46} color={COLORS.secondaryText} />
                </View>

                <Text style={styles.emptyTitle}>
                    Your cart is empty
                </Text>

                <Text style={styles.emptySubtitle}>
                    Explore our products and add something you love.
                </Text>

                <Pressable
                    style={styles.shopButton}
                    onPress={() => router.push("/products")}
                >
                    <Text style={styles.shopButtonText}>
                        Explore Products
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.backButton}>←</Text>
                </Pressable>

                <Text style={styles.headerTitle}>
                    My Cart
                </Text>

                <Text style={styles.headerCount}>
                    {cartItems.length} {cartItems.length === 1 ? "product" : "products"}
                </Text>
            </View>

            {/* Cart Products */}
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.cartCard}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.productImage}
                            resizeMode="contain"
                        />

                        <View style={styles.productInfo}>
                            <Text
                                style={styles.productTitle}
                                numberOfLines={2}
                            >
                                {item.title}
                            </Text>

                            <Text style={styles.category}>
                                {item.category}
                            </Text>

                            <Text style={styles.price}>
                                {formatUSDToINR(item.price)}
                            </Text>

                            <View style={styles.actions}>
                                <View style={styles.quantityControls}>
                                    <Pressable
                                        style={styles.quantityButton}
                                        onPress={() => decreaseQuantity(item.id)}
                                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                    >
                                        <Text style={styles.quantityText}>−</Text>
                                    </Pressable>

                                    <Text style={styles.quantityValue}>
                                        {item.quantity}
                                    </Text>

                                    <Pressable
                                        style={styles.quantityButton}
                                        onPress={() => increaseQuantity(item.id)}
                                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                    >
                                        <Text style={styles.quantityText}>+</Text>
                                    </Pressable>
                                </View>

                                <Pressable
                                    onPress={() => removeFromCart(item.id)}
                                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                >
                                    <Text style={styles.removeText}>
                                        Remove
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                )}
            />

            {/* Sticky Checkout Section */}
            <View
                style={[
                    styles.bottomBar,
                    { paddingBottom: Math.max(insets.bottom, 16) },
                ]}
            >
                <View style={styles.subtotalRow}>
                    <Text style={styles.subtotalLabel}>
                        Subtotal
                    </Text>

                    <Text style={styles.subtotalValue}>
                        {formatUSDToINR(subtotal)}
                    </Text>
                </View>

                <Pressable
                    style={[
                        styles.checkoutButton,
                        cartItems.length === 0 && styles.checkoutButtonDisabled,
                    ]}
                    onPress={handleOpenCheckout}
                    disabled={cartItems.length === 0}
                >
                    <Text style={styles.checkoutText}>
                        Proceed to Checkout →
                    </Text>
                </Pressable>
            </View>

            {/* Detailed Checkout Order Summary Modal */}
            <Modal
                visible={checkoutModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setCheckoutModalVisible(false)}
            >
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setCheckoutModalVisible(false)}
                >
                    <Pressable
                        style={[
                            styles.modalCard,
                            { paddingBottom: Math.max(insets.bottom, 20) },
                        ]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.sheetHandle} />

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Order Summary</Text>
                            <View style={styles.testBadge}>
                                <Text style={styles.testBadgeText}>Simulated</Text>
                            </View>
                        </View>

                        <Text style={styles.modalSubtitle}>
                            Review all products and totals before placing your order.
                        </Text>

                        {/* Scrollable list of ALL products in cart */}
                        <ScrollView
                            style={styles.modalProductsScroll}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.modalItemsList}>
                                {cartItems.map((item) => {
                                    const lineTotalUSD = item.price * item.quantity;
                                    return (
                                        <View key={item.id} style={styles.modalItemRow}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={styles.modalItemImage}
                                                resizeMode="contain"
                                            />
                                            <View style={styles.modalItemContent}>
                                                <Text
                                                    style={styles.modalItemName}
                                                    numberOfLines={1}
                                                >
                                                    {item.title}
                                                </Text>
                                                <Text style={styles.modalItemPricing}>
                                                    Unit: {formatUSDToINR(item.price)} × Qty: {item.quantity}
                                                </Text>
                                            </View>
                                            <Text style={styles.modalItemLineTotal}>
                                                {formatUSDToINR(lineTotalUSD)}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>

                            {/* Order Totals Breakdown */}
                            <View style={styles.orderSummaryCard}>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Total Items</Text>
                                    <Text style={styles.summaryValue}>
                                        {cartCount} {cartCount === 1 ? "item" : "items"}
                                    </Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Subtotal</Text>
                                    <Text style={styles.summaryValue}>
                                        {formatUSDToINR(subtotal)}
                                    </Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Delivery</Text>
                                    <Text style={styles.summaryValueFree}>FREE</Text>
                                </View>

                                <View style={styles.summaryDivider} />

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryTotalLabel}>Grand Total</Text>
                                    <Text style={styles.summaryTotalValue}>
                                        {formatUSDToINR(subtotal)}
                                    </Text>
                                </View>
                            </View>

                            {/* Simulation Notice */}
                            <View style={styles.simulationNotice}>
                                <ShieldCheckIcon size={16} color={COLORS.primary} />
                                <Text style={styles.simulationNoticeText}>
                                    This is a simulated checkout. No real payment will be charged.
                                </Text>
                            </View>
                        </ScrollView>

                        {/* Action buttons */}
                        <View style={styles.modalActions}>
                            <Pressable
                                style={styles.cancelButton}
                                onPress={() => setCheckoutModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>

                            <Pressable
                                style={styles.placeOrderButton}
                                onPress={handlePlaceOrder}
                            >
                                <Text style={styles.placeOrderButtonText}>
                                    Place Order · {formatUSDToINR(subtotal)}
                                </Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    header: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    backButton: {
        fontSize: 24,
        color: COLORS.primary,
        marginBottom: 10,
    },

    headerTitle: {
        fontFamily: "Outfit_700Bold",
        fontSize: 26,
        color: COLORS.text,
    },

    headerCount: {
        fontFamily: "Outfit_400Regular",
        fontSize: 14,
        color: COLORS.secondaryText,
        marginTop: 4,
    },

    list: {
        padding: 16,
        paddingBottom: 30,
    },

    cartCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    productImage: {
        width: 90,
        height: 110,
        marginRight: 14,
    },

    productInfo: {
        flex: 1,
    },

    productTitle: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 15,
        color: COLORS.text,
    },

    category: {
        fontFamily: "Outfit_400Regular",
        fontSize: 12,
        color: COLORS.secondaryText,
        marginTop: 5,
    },

    price: {
        fontFamily: "Outfit_700Bold",
        fontSize: 18,
        color: COLORS.primary,
        marginTop: 8,
    },

    actions: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
    },

    quantityControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    quantityButton: {
        width: 30,
        height: 30,
        backgroundColor: COLORS.background,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    quantityText: {
        fontSize: 20,
        color: COLORS.primary,
    },

    quantityValue: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 15,
        color: COLORS.text,
    },

    removeText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 13,
        color: COLORS.error,
    },

    bottomBar: {
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        padding: 20,
    },

    subtotalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 18,
    },

    subtotalLabel: {
        fontFamily: "Outfit_500Medium",
        fontSize: 16,
        color: COLORS.secondaryText,
    },

    subtotalValue: {
        fontFamily: "Outfit_700Bold",
        fontSize: 23,
        color: COLORS.primary,
    },

    checkoutButton: {
        backgroundColor: COLORS.primary,
        padding: 17,
        borderRadius: 14,
        alignItems: "center",
    },

    checkoutButtonDisabled: {
        opacity: 0.5,
    },

    checkoutText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
    },

    emptyContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },

    emptyIconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: "rgba(15, 61, 46, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },

    emptyTitle: {
        fontFamily: "Outfit_700Bold",
        fontSize: 24,
        color: COLORS.text,
    },

    emptySubtitle: {
        fontFamily: "Outfit_400Regular",
        fontSize: 15,
        color: COLORS.secondaryText,
        textAlign: "center",
        marginTop: 10,
        marginBottom: 25,
        lineHeight: 22,
    },

    shopButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 26,
        paddingVertical: 14,
        borderRadius: 12,
    },

    shopButtonText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 15,
        color: "#FFFFFF",
    },

    // Success State Styles
    successScrollView: {
        flex: 1,
    },

    successScrollContent: {
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    successIconWrapper: {
        marginBottom: 16,
    },

    successTitle: {
        fontFamily: "Outfit_700Bold",
        fontSize: 24,
        color: COLORS.primary,
        textAlign: "center",
        marginBottom: 8,
    },

    successSubtitle: {
        fontFamily: "Outfit_400Regular",
        fontSize: 14.5,
        color: COLORS.secondaryText,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 20,
        paddingHorizontal: 12,
    },

    receiptCard: {
        width: "100%",
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 22,
    },

    receiptHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 14,
    },

    receiptHeaderTitle: {
        fontFamily: "Outfit_700Bold",
        fontSize: 16,
        color: COLORS.text,
    },

    receiptOrderId: {
        fontFamily: "Outfit_400Regular",
        fontSize: 12,
        color: COLORS.secondaryText,
        marginTop: 2,
    },

    simulatedBadge: {
        backgroundColor: "rgba(242, 176, 30, 0.16)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },

    simulatedBadgeText: {
        fontFamily: "Outfit_700Bold",
        fontSize: 10,
        color: "#9E6D00",
        letterSpacing: 0.8,
    },

    receiptItemsList: {
        gap: 10,
    },

    receiptItemRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
    },

    receiptItemThumb: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    receiptItemInfo: {
        flex: 1,
        marginRight: 8,
    },

    receiptItemTitle: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 13.5,
        color: COLORS.text,
    },

    receiptItemSub: {
        fontFamily: "Outfit_400Regular",
        fontSize: 12,
        color: COLORS.secondaryText,
        marginTop: 2,
    },

    receiptItemLineTotal: {
        fontFamily: "Outfit_700Bold",
        fontSize: 14,
        color: COLORS.primary,
    },

    receiptRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 4,
    },

    receiptLabel: {
        fontFamily: "Outfit_400Regular",
        fontSize: 13.5,
        color: COLORS.secondaryText,
    },

    receiptValue: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 13.5,
        color: COLORS.text,
    },

    receiptValueFree: {
        fontFamily: "Outfit_700Bold",
        fontSize: 13,
        color: COLORS.primary,
    },

    receiptDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },

    receiptTotalLabel: {
        fontFamily: "Outfit_700Bold",
        fontSize: 16,
        color: COLORS.text,
    },

    receiptTotalValue: {
        fontFamily: "Outfit_700Bold",
        fontSize: 19,
        color: COLORS.primary,
    },

    continueShoppingButton: {
        backgroundColor: COLORS.primary,
        width: "100%",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
    },

    continueShoppingText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
    },

    // Modal Styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        justifyContent: "flex-end",
    },

    modalCard: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        paddingHorizontal: 20,
        maxHeight: "85%",
    },

    sheetHandle: {
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#DCDAD4",
        alignSelf: "center",
        marginBottom: 14,
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },

    modalTitle: {
        fontFamily: "Outfit_700Bold",
        fontSize: 20,
        color: COLORS.text,
    },

    testBadge: {
        backgroundColor: "rgba(15, 61, 46, 0.08)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },

    testBadgeText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 11,
        color: COLORS.primary,
    },

    modalSubtitle: {
        fontFamily: "Outfit_400Regular",
        fontSize: 13.5,
        color: COLORS.secondaryText,
        marginBottom: 12,
    },

    modalProductsScroll: {
        maxHeight: 320,
    },

    modalItemsList: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 12,
        gap: 10,
    },

    modalItemRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    modalItemImage: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    modalItemContent: {
        flex: 1,
        marginRight: 8,
    },

    modalItemName: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 13.5,
        color: COLORS.text,
    },

    modalItemPricing: {
        fontFamily: "Outfit_400Regular",
        fontSize: 12,
        color: COLORS.secondaryText,
        marginTop: 2,
    },

    modalItemLineTotal: {
        fontFamily: "Outfit_700Bold",
        fontSize: 14,
        color: COLORS.primary,
    },

    orderSummaryCard: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 12,
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 3,
    },

    summaryLabel: {
        fontFamily: "Outfit_400Regular",
        fontSize: 13.5,
        color: COLORS.secondaryText,
    },

    summaryValue: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 13.5,
        color: COLORS.text,
    },

    summaryValueFree: {
        fontFamily: "Outfit_700Bold",
        fontSize: 13,
        color: COLORS.primary,
    },

    summaryDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 8,
    },

    summaryTotalLabel: {
        fontFamily: "Outfit_700Bold",
        fontSize: 15,
        color: COLORS.text,
    },

    summaryTotalValue: {
        fontFamily: "Outfit_700Bold",
        fontSize: 18,
        color: COLORS.primary,
    },

    simulationNotice: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(15, 61, 46, 0.05)",
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 14,
    },

    simulationNoticeText: {
        fontFamily: "Outfit_400Regular",
        fontSize: 12,
        color: COLORS.primary,
        marginLeft: 8,
        flex: 1,
        lineHeight: 16,
    },

    modalActions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },

    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
        backgroundColor: COLORS.background,
    },

    cancelButtonText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 15,
        color: COLORS.text,
    },

    placeOrderButton: {
        flex: 1.6,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: "center",
    },

    placeOrderButtonText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 15,
        color: "#FFFFFF",
    },
});