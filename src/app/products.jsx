import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    Pressable,
    Modal,
    StatusBar,
    ScrollView,
    Animated,
    Easing,
    AccessibilityInfo,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Line, Circle } from "react-native-svg";

import { getProducts } from "../services/productApi";
import { COLORS } from "../constants/theme";
import ProductCard from "../components/ProductCard";
import DukaanLogo from "../components/DukaanLogo";
import { useCart } from "../context/CartContext";

// Clean Professional SVG Icons
function ShoppingCartIcon({ size = 22, color = COLORS.primary }) {
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
            <Circle cx="9" cy="20" r="1.5" />
            <Circle cx="19" cy="20" r="1.5" />
            <Path d="M1 1h4l2.6 12.8a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 5H5.4" />
        </Svg>
    );
}

function SearchIcon({ size = 18, color = COLORS.secondaryText }) {
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
            <Circle cx="11" cy="11" r="7.5" />
            <Line x1="21" y1="21" x2="16.5" y2="16.5" />
        </Svg>
    );
}

function FilterSlidersIcon({ size = 18, color = COLORS.primary }) {
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
            <Line x1="4" y1="21" x2="4" y2="14" />
            <Line x1="4" y1="10" x2="4" y2="3" />
            <Line x1="12" y1="21" x2="12" y2="12" />
            <Line x1="12" y1="8" x2="12" y2="3" />
            <Line x1="20" y1="21" x2="20" y2="16" />
            <Line x1="20" y1="12" x2="20" y2="3" />
            <Line x1="1" y1="14" x2="7" y2="14" />
            <Line x1="9" y1="8" x2="15" y2="8" />
            <Line x1="17" y1="16" x2="23" y2="16" />
        </Svg>
    );
}

function ClearIcon({ size = 12, color = COLORS.secondaryText }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Line x1="18" y1="6" x2="6" y2="18" />
            <Line x1="6" y1="6" x2="18" y2="18" />
        </Svg>
    );
}

function CheckmarkIcon({ size = 16, color = COLORS.primary }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Path d="M20 6L9 17l-5-5" />
        </Svg>
    );
}

function EmptySearchIcon({ size = 52, color = COLORS.secondaryText }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Circle cx="11" cy="11" r="7.5" />
            <Line x1="21" y1="21" x2="16.5" y2="16.5" />
            <Line x1="8.5" y1="11" x2="13.5" y2="11" />
        </Svg>
    );
}

const CATEGORIES = [
    "All",
    "Men's Clothing",
    "Women's Clothing",
    "Electronics",
    "Jewelry",
];

// Premium Skeleton Card matching ProductCard geometry 1:1
function ProductCardSkeleton({ shimmerAnim }) {
    return (
        <View style={styles.skeletonCard}>
            {/* Rectangular Image Placeholder */}
            <View style={styles.skeletonImageContainer}>
                <Animated.View
                    style={[
                        styles.skeletonBlock,
                        styles.skeletonImage,
                        { opacity: shimmerAnim },
                    ]}
                />
            </View>

            {/* Content Placeholders */}
            <View style={styles.skeletonContent}>
                {/* Category Placeholder */}
                <Animated.View
                    style={[
                        styles.skeletonBlock,
                        styles.skeletonCategory,
                        { opacity: shimmerAnim },
                    ]}
                />

                {/* Two Title Line Placeholders */}
                <Animated.View
                    style={[
                        styles.skeletonBlock,
                        styles.skeletonTitleLine1,
                        { opacity: shimmerAnim },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.skeletonBlock,
                        styles.skeletonTitleLine2,
                        { opacity: shimmerAnim },
                    ]}
                />

                {/* Price Placeholder */}
                <Animated.View
                    style={[
                        styles.skeletonBlock,
                        styles.skeletonPrice,
                        { opacity: shimmerAnim },
                    ]}
                />
            </View>
        </View>
    );
}

// Animated Product Card with Staggered Entrance & Press Microinteraction
function AnimatedProductCardItem({ product, index, onPress }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(18)).current;
    const pressScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let isMounted = true;
        // Only stagger the first 8 cards (above the fold) to keep scrolling fast & non-blocking
        const delay = Math.min(index, 8) * 45;

        const timer = setTimeout(() => {
            if (!isMounted) return;
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
        }, delay);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

    const handlePressIn = () => {
        Animated.spring(pressScale, {
            toValue: 0.965,
            speed: 50,
            bounciness: 4,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressScale, {
            toValue: 1,
            speed: 50,
            bounciness: 4,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.cardAnimatedWrapper,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY }, { scale: pressScale }],
                },
            ]}
        >
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.cardPressable}
            >
                <View pointerEvents="none" style={styles.cardInnerContainer}>
                    <ProductCard product={product} />
                </View>
            </Pressable>
        </Animated.View>
    );
}

// Category Pill with Smooth Press Feedback
function CategoryChip({ category, isSelected, onSelect }) {
    const pillScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(pillScale, {
            toValue: 0.94,
            speed: 50,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pillScale, {
            toValue: 1,
            speed: 40,
            bounciness: 5,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: pillScale }] }}>
            <Pressable
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => onSelect(category)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Text
                    style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                    ]}
                >
                    {category}
                </Text>
            </Pressable>
        </Animated.View>
    );
}

export default function ProductsScreen() {
    const insets = useSafeAreaInsets();
    const { cartCount } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and Category states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    // Microinteraction & Transition Animation Refs
    const cartScale = useRef(new Animated.Value(1)).current;
    const filterScale = useRef(new Animated.Value(1)).current;
    const searchBorderAnim = useRef(new Animated.Value(0)).current;
    const listOpacity = useRef(new Animated.Value(1)).current;
    const contentFadeAnim = useRef(new Animated.Value(0)).current;

    // Single shared shimmer animation value for all skeleton placeholders
    const shimmerAnim = useRef(new Animated.Value(0.42)).current;
    const shimmerLoopRef = useRef(null);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProducts();
            setProducts(data || []);
        } catch (err) {
            setError("Unable to load products");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        const init = async () => {
            try {
                const data = await getProducts();
                if (active) {
                    setProducts(data || []);
                }
            } catch (err) {
                if (active) {
                    setError("Unable to load products");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        init();

        return () => {
            active = false;
        };
    }, []);

    // Shimmer pulse animation loop management
    useEffect(() => {
        if (loading) {
            let isMounted = true;
            AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
                if (!isMounted) return;
                if (reduceMotion) {
                    shimmerAnim.setValue(0.7);
                    return;
                }

                shimmerLoopRef.current = Animated.loop(
                    Animated.sequence([
                        Animated.timing(shimmerAnim, {
                            toValue: 0.95,
                            duration: 750,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(shimmerAnim, {
                            toValue: 0.42,
                            duration: 750,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ])
                );
                shimmerLoopRef.current.start();
            });

            return () => {
                isMounted = false;
                if (shimmerLoopRef.current) {
                    shimmerLoopRef.current.stop();
                }
            };
        } else {
            // Stop loop when loading completes
            if (shimmerLoopRef.current) {
                shimmerLoopRef.current.stop();
            }

            // Smoothly reveal content
            contentFadeAnim.setValue(0);
            Animated.timing(contentFadeAnim, {
                toValue: 1,
                duration: 280,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [loading]);

    // Smooth transition when search query or category filters change
    useEffect(() => {
        listOpacity.setValue(0.72);
        Animated.timing(listOpacity, {
            toValue: 1,
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }, [selectedCategory, searchQuery]);

    // Category matching helper
    const matchesCategory = useCallback((productCategory, targetCategory) => {
        if (!productCategory || targetCategory === "All") return true;

        const prodCat = productCategory.toLowerCase().trim();
        const target = targetCategory.toLowerCase().trim();

        if (target === "men's clothing") {
            return prodCat.includes("men's") && !prodCat.includes("women");
        }
        if (target === "women's clothing") {
            return prodCat.includes("women");
        }
        if (target === "electronics") {
            return prodCat.includes("electr");
        }
        if (target === "jewelry") {
            return prodCat.includes("jewel");
        }

        return prodCat === target;
    }, []);

    // Product counts per category
    const getCategoryCount = useCallback(
        (categoryName) => {
            if (categoryName === "All") return products.length;
            return products.filter((p) => matchesCategory(p.category, categoryName)).length;
        },
        [products, matchesCategory]
    );

    // Filtered products based on search query and category
    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return products.filter((product) => {
            const matchesSearch = query
                ? product.title.toLowerCase().includes(query)
                : true;
            const matchesCat = matchesCategory(product.category, selectedCategory);
            return matchesSearch && matchesCat;
        });
    }, [products, searchQuery, selectedCategory, matchesCategory]);

    // Microinteraction handlers
    const handleCartPressIn = () => {
        Animated.spring(cartScale, {
            toValue: 0.9,
            speed: 50,
            bounciness: 4,
            useNativeDriver: true,
        }).start();
    };

    const handleCartPressOut = () => {
        Animated.spring(cartScale, {
            toValue: 1,
            speed: 50,
            bounciness: 5,
            useNativeDriver: true,
        }).start();
    };

    const handleFilterPressIn = () => {
        Animated.spring(filterScale, {
            toValue: 0.88,
            speed: 50,
            bounciness: 4,
            useNativeDriver: true,
        }).start();
    };

    const handleFilterPressOut = () => {
        Animated.spring(filterScale, {
            toValue: 1,
            speed: 50,
            bounciness: 5,
            useNativeDriver: true,
        }).start();
    };

    const handleSearchFocus = () => {
        Animated.timing(searchBorderAnim, {
            toValue: 1,
            duration: 180,
            useNativeDriver: false,
        }).start();
    };

    const handleSearchBlur = () => {
        Animated.timing(searchBorderAnim, {
            toValue: 0,
            duration: 180,
            useNativeDriver: false,
        }).start();
    };

    const searchBorderColor = searchBorderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.border, COLORS.primary],
    });

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handleResetAllFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setFilterModalVisible(false);
    };

    // Error state with retry
    if (error) {
        return (
            <View style={[styles.center, { paddingTop: insets.top }]}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
                <Text style={styles.errorMessage}>{error}</Text>
                <Pressable style={styles.retryButton} onPress={loadProducts}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </Pressable>
            </View>
        );
    }

    const isCategoryFiltered = selectedCategory !== "All";

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, 14) }]}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Premium Header */}
            <View style={styles.header}>
                <View style={styles.brandContainer}>
                    <DukaanLogo size={36} />
                    <View style={styles.brandTextGroup}>
                        <Text style={styles.brandName}>Dukaan</Text>
                        <Text style={styles.brandSub}>STORE</Text>
                    </View>
                </View>

                {/* Animated Cart Button */}
                <Animated.View style={{ transform: [{ scale: cartScale }] }}>
                    <Pressable
                        style={styles.cartButton}
                        onPress={() => router.push("/cart")}
                        onPressIn={handleCartPressIn}
                        onPressOut={handleCartPressOut}
                        accessibilityLabel="Shopping Cart"
                        accessibilityRole="button"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <ShoppingCartIcon size={23} color={COLORS.primary} />
                        {cartCount > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>
                                    {cartCount > 99 ? "99+" : cartCount}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </Animated.View>
            </View>

            {/* Search Bar with Focus Border Animation & Filter Button */}
            <View style={styles.searchSection}>
                <Animated.View
                    style={[
                        styles.searchBarContainer,
                        { borderColor: searchBorderColor },
                    ]}
                >
                    <View style={styles.searchIconWrapper}>
                        <SearchIcon size={18} color={COLORS.secondaryText} />
                    </View>

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor="#969696"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        returnKeyType="search"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="never"
                        editable={!loading}
                    />

                    {searchQuery.length > 0 && (
                        <Pressable
                            style={styles.clearButton}
                            onPress={handleClearSearch}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            accessibilityLabel="Clear search"
                        >
                            <View style={styles.clearIconCircle}>
                                <ClearIcon size={12} color="#666666" />
                            </View>
                        </Pressable>
                    )}

                    <View style={styles.searchDivider} />

                    <Animated.View style={{ transform: [{ scale: filterScale }] }}>
                        <Pressable
                            style={[
                                styles.filterIconButton,
                                isCategoryFiltered && styles.filterIconButtonActive,
                            ]}
                            onPress={() => setFilterModalVisible(true)}
                            onPressIn={handleFilterPressIn}
                            onPressOut={handleFilterPressOut}
                            accessibilityLabel="Filter by category"
                            disabled={loading}
                        >
                            <FilterSlidersIcon
                                size={18}
                                color={isCategoryFiltered ? "#FFFFFF" : COLORS.primary}
                            />
                            {isCategoryFiltered && (
                                <View style={styles.activeFilterDot} />
                            )}
                        </Pressable>
                    </Animated.View>
                </Animated.View>
            </View>

            {/* Category Quick Chips with Spring Microinteractions */}
            <View style={styles.chipsSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsScrollContent}
                >
                    {CATEGORIES.map((cat) => (
                        <CategoryChip
                            key={cat}
                            category={cat}
                            isSelected={selectedCategory === cat}
                            onSelect={setSelectedCategory}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Active Filter Status Bar */}
            {!loading && (isCategoryFiltered || searchQuery.trim().length > 0) && (
                <View style={styles.activeFiltersBar}>
                    <Text style={styles.resultsCountText}>
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "product" : "products"} found
                    </Text>
                    <Pressable
                        onPress={handleResetAllFilters}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                        <Text style={styles.resetFiltersText}>Reset all</Text>
                    </Pressable>
                </View>
            )}

            {/* Content Area: Skeleton Placeholders while loading, otherwise Product Grid */}
            {loading ? (
                /* 6 Skeleton Cards in 2-column grid matching product layout */
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                >
                    <View style={styles.columnWrapper}>
                        <ProductCardSkeleton shimmerAnim={shimmerAnim} />
                        <ProductCardSkeleton shimmerAnim={shimmerAnim} />
                    </View>
                    <View style={styles.columnWrapper}>
                        <ProductCardSkeleton shimmerAnim={shimmerAnim} />
                        <ProductCardSkeleton shimmerAnim={shimmerAnim} />
                    </View>
                    <View style={styles.columnWrapper}>
                        <ProductCardSkeleton shimmerAnim={shimmerAnim} />
                        <ProductCardSkeleton shimmerAnim={shimmerAnim} />
                    </View>
                </ScrollView>
            ) : (
                /* Smooth Transition Animated Container for Product Listing or Empty State */
                <Animated.View
                    style={[
                        styles.listWrapper,
                        { opacity: contentFadeAnim },
                        { opacity: listOpacity },
                    ]}
                >
                    {filteredProducts.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <EmptySearchIcon size={44} color={COLORS.secondaryText} />
                            </View>
                            <Text style={styles.emptyTitle}>No products found</Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery.trim().length > 0 && isCategoryFiltered
                                    ? `No results for "${searchQuery}" in ${selectedCategory}.`
                                    : searchQuery.trim().length > 0
                                    ? `No products match "${searchQuery}".`
                                    : `No products available in ${selectedCategory}.`}
                            </Text>
                            <Pressable
                                style={styles.emptyActionButton}
                                onPress={handleResetAllFilters}
                            >
                                <Text style={styles.emptyActionText}>Clear Filters</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredProducts}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={styles.columnWrapper}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item, index }) => (
                                <AnimatedProductCardItem
                                    product={item}
                                    index={index}
                                    onPress={() => router.push(`/product/${item.id}`)}
                                />
                            )}
                        />
                    )}
                </Animated.View>
            )}

            {/* Category Filter Modal Bottom Sheet */}
            <Modal
                visible={filterModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setFilterModalVisible(false)}
                >
                    <Pressable
                        style={[
                            styles.modalSheet,
                            { paddingBottom: Math.max(insets.bottom, 20) },
                        ]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.sheetHandle} />

                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Filter by Category</Text>
                            <Pressable
                                onPress={() => {
                                    setSelectedCategory("All");
                                }}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Text style={styles.sheetResetAction}>Reset</Text>
                            </Pressable>
                        </View>

                        <View style={styles.categoryOptionsList}>
                            {CATEGORIES.map((category) => {
                                const isSelected = selectedCategory === category;
                                const count = getCategoryCount(category);

                                return (
                                    <Pressable
                                        key={category}
                                        style={[
                                            styles.categoryRow,
                                            isSelected && styles.categoryRowSelected,
                                        ]}
                                        onPress={() => {
                                            setSelectedCategory(category);
                                            setFilterModalVisible(false);
                                        }}
                                    >
                                        <View style={styles.categoryRowLeft}>
                                            <View
                                                style={[
                                                    styles.radioCircle,
                                                    isSelected && styles.radioCircleSelected,
                                                ]}
                                            >
                                                {isSelected && (
                                                    <CheckmarkIcon size={13} color="#FFFFFF" />
                                                )}
                                            </View>
                                            <Text
                                                style={[
                                                    styles.categoryRowText,
                                                    isSelected && styles.categoryRowTextSelected,
                                                ]}
                                            >
                                                {category}
                                            </Text>
                                        </View>

                                        <View
                                            style={[
                                                styles.countBadge,
                                                isSelected && styles.countBadgeSelected,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.countBadgeText,
                                                    isSelected && styles.countBadgeTextSelected,
                                                ]}
                                            >
                                                {count}
                                            </Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Pressable
                            style={styles.applyFilterButton}
                            onPress={() => setFilterModalVisible(false)}
                        >
                            <Text style={styles.applyFilterButtonText}>
                                View Results
                            </Text>
                        </Pressable>
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

    // Header Styles
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    brandTextGroup: {
        marginLeft: 10,
        justifyContent: "center",
    },
    brandName: {
        fontFamily: "Outfit_700Bold",
        fontSize: 22,
        color: COLORS.primary,
        letterSpacing: 0.2,
        lineHeight: 24,
    },
    brandSub: {
        fontFamily: "Outfit_500Medium",
        fontSize: 9.5,
        color: COLORS.accent,
        letterSpacing: 1.5,
        fontWeight: "600",
        marginTop: 1,
    },
    cartButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.surface,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        position: "relative",
    },
    cartBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: COLORS.accent,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: COLORS.surface,
    },
    cartBadgeText: {
        fontFamily: "Outfit_700Bold",
        fontSize: 10.5,
        color: COLORS.primary,
    },

    // Search Section
    searchSection: {
        paddingHorizontal: 16,
        marginTop: 2,
        marginBottom: 10,
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        borderWidth: 1,
        height: 50,
        paddingHorizontal: 12,
    },
    searchIconWrapper: {
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    searchInput: {
        flex: 1,
        fontFamily: "Outfit_400Regular",
        fontSize: 15,
        color: COLORS.text,
        height: "100%",
        paddingVertical: 0,
    },
    clearButton: {
        paddingHorizontal: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    clearIconCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#EAE7E0",
        justifyContent: "center",
        alignItems: "center",
    },
    searchDivider: {
        width: 1,
        height: 22,
        backgroundColor: COLORS.border,
        marginHorizontal: 8,
    },
    filterIconButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "rgba(15, 61, 46, 0.06)",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    filterIconButtonActive: {
        backgroundColor: COLORS.primary,
    },
    activeFilterDot: {
        position: "absolute",
        top: 2,
        right: 2,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: COLORS.accent,
        borderWidth: 1.2,
        borderColor: COLORS.primary,
    },

    // Category Chips
    chipsSection: {
        marginBottom: 10,
    },
    chipsScrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    chip: {
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 13,
        color: COLORS.secondaryText,
    },
    chipTextSelected: {
        color: "#FFFFFF",
        fontFamily: "Outfit_600SemiBold",
    },

    // Active Filters Info Bar
    activeFiltersBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingBottom: 8,
    },
    resultsCountText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 12.5,
        color: COLORS.secondaryText,
    },
    resetFiltersText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 12.5,
        color: COLORS.primary,
        textDecorationLine: "underline",
    },

    // List Wrapper & Animation Styles
    listWrapper: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 28,
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    cardAnimatedWrapper: {
        flex: 1,
    },
    cardPressable: {
        flex: 1,
    },
    cardInnerContainer: {
        flex: 1,
    },

    // Skeleton Placeholder Styles
    skeletonCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        overflow: "hidden",
        margin: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    skeletonImageContainer: {
        width: "100%",
        height: 150,
        backgroundColor: "#FAF9F6",
        justifyContent: "center",
        alignItems: "center",
    },
    skeletonBlock: {
        backgroundColor: "#E6E4DD", // Soft neutral tone complementing Dukaan cream
        borderRadius: 5,
    },
    skeletonImage: {
        width: "100%",
        height: "100%",
        borderRadius: 0,
    },
    skeletonContent: {
        padding: 12,
    },
    skeletonCategory: {
        width: "42%",
        height: 11,
        marginBottom: 8,
    },
    skeletonTitleLine1: {
        width: "88%",
        height: 13,
        marginBottom: 6,
    },
    skeletonTitleLine2: {
        width: "58%",
        height: 13,
        marginBottom: 12,
    },
    skeletonPrice: {
        width: "45%",
        height: 17,
        borderRadius: 5,
    },

    // Empty State Styles
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingBottom: 40,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(15, 61, 46, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    emptyTitle: {
        fontFamily: "Outfit_700Bold",
        fontSize: 20,
        color: COLORS.text,
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtitle: {
        fontFamily: "Outfit_400Regular",
        fontSize: 14,
        color: COLORS.secondaryText,
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 20,
    },
    emptyActionButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    emptyActionText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
    },

    // Center / Loading / Error
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        padding: 20,
    },
    errorMessage: {
        fontFamily: "Outfit_500Medium",
        fontSize: 15,
        color: COLORS.error,
        textAlign: "center",
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 10,
    },
    retryButtonText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
    },

    // Category Modal Bottom Sheet Styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        justifyContent: "flex-end",
    },
    modalSheet: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        paddingHorizontal: 20,
        maxHeight: "80%",
    },
    sheetHandle: {
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#DCDAD4",
        alignSelf: "center",
        marginBottom: 16,
    },
    sheetHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    sheetTitle: {
        fontFamily: "Outfit_700Bold",
        fontSize: 18,
        color: COLORS.text,
    },
    sheetResetAction: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 13.5,
        color: COLORS.primary,
    },
    categoryOptionsList: {
        gap: 8,
        marginBottom: 20,
    },
    categoryRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    categoryRowSelected: {
        backgroundColor: "rgba(15, 61, 46, 0.08)",
        borderColor: COLORS.primary,
    },
    categoryRowLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: COLORS.secondaryText,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        backgroundColor: "transparent",
    },
    radioCircleSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryRowText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 15,
        color: COLORS.text,
    },
    categoryRowTextSelected: {
        fontFamily: "Outfit_700Bold",
        color: COLORS.primary,
    },
    countBadge: {
        backgroundColor: "rgba(0,0,0,0.05)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    countBadgeSelected: {
        backgroundColor: COLORS.primary,
    },
    countBadgeText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 12,
        color: COLORS.secondaryText,
    },
    countBadgeTextSelected: {
        color: "#FFFFFF",
    },
    applyFilterButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },
    applyFilterButtonText: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 15,
        color: "#FFFFFF",
    },
});