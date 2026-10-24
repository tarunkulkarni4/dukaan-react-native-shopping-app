import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { COLORS } from "../constants/theme";
import { formatUSDToINR } from "../utils/currency";

export default function ProductCard({ product, onPress }) {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="contain"
            />

            <View style={styles.content}>
                <Text style={styles.category}>{product.category}</Text>

                <Text style={styles.title} numberOfLines={2}>
                    {product.title}
                </Text>

                <Text style={styles.price}>{formatUSDToINR(product.price)}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        overflow: "hidden",
        margin: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    image: {
        width: "100%",
        height: 150,
        backgroundColor: "#FFFFFF",
    },
    content: {
        padding: 12,
    },
    category: {
        fontFamily: "Outfit_400Regular",
        fontSize: 12,
        color: COLORS.secondaryText,
    },
    title: {
        fontFamily: "Outfit_500Medium",
        fontSize: 14,
        color: COLORS.text,
        marginTop: 6,
        minHeight: 40,
    },
    price: {
        fontFamily: "Outfit_700Bold",
        fontSize: 17,
        color: COLORS.primary,
        marginTop: 8,
    },
});