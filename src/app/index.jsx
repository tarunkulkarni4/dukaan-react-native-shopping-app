import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Animated,
    Easing,
    ActivityIndicator,
    AccessibilityInfo,
} from "react-native";
import { router } from "expo-router";

import DukaanLogo from "../components/DukaanLogo";
import { COLORS } from "../constants/theme";

const BRAND_LETTERS = ["D", "u", "k", "a", "a", "n"];

export default function SplashScreen() {
    // Screen container fade-out on exit
    const screenOpacity = useRef(new Animated.Value(1)).current;

    // Ripple effect behind logo
    const rippleScale = useRef(new Animated.Value(0.65)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;

    // Logo entrance
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.86)).current;
    const logoRotate = useRef(new Animated.Value(-1)).current; // -1 to 0 for -3deg to 0deg

    // Brand name staggered letter reveals
    const letterAnims = useRef(
        BRAND_LETTERS.map(() => new Animated.Value(0))
    ).current;

    // Yellow accent underline beneath brand name
    const accentScaleX = useRef(new Animated.Value(0)).current;
    const accentOpacity = useRef(new Animated.Value(0)).current;

    // Tagline and bottom status
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const taglineTranslateY = useRef(new Animated.Value(6)).current;
    const footerOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let isMounted = true;
        let navTimer = null;
        let exitTimer = null;

        AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
            if (!isMounted) return;

            if (reduceMotion) {
                // Instantly show elements if user requested reduced motion
                screenOpacity.setValue(1);
                logoOpacity.setValue(1);
                logoScale.setValue(1);
                logoRotate.setValue(0);
                letterAnims.forEach((anim) => anim.setValue(1));
                accentScaleX.setValue(1);
                accentOpacity.setValue(1);
                taglineOpacity.setValue(1);
                taglineTranslateY.setValue(0);
                footerOpacity.setValue(1);

                navTimer = setTimeout(() => {
                    if (isMounted) router.replace("/products");
                }, 1800);
                return;
            }

            // Cinematic orchestrated animation sequence
            Animated.parallel([
                // 1. Expanding soft circular ripple behind logo
                Animated.sequence([
                    Animated.delay(100),
                    Animated.parallel([
                        Animated.timing(rippleOpacity, {
                            toValue: 0.5,
                            duration: 350,
                            easing: Easing.out(Easing.quad),
                            useNativeDriver: true,
                        }),
                        Animated.timing(rippleScale, {
                            toValue: 1.4,
                            duration: 1100,
                            easing: Easing.out(Easing.cubic),
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.timing(rippleOpacity, {
                        toValue: 0,
                        duration: 500,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }),
                ]),

                // 2. Smooth scale-up and subtle rotation of Dukaan logo
                Animated.parallel([
                    Animated.timing(logoOpacity, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(logoScale, {
                        toValue: 1,
                        duration: 950,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(logoRotate, {
                        toValue: 0,
                        duration: 900,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                ]),

                // 3. Staggered letter-reveal for "Dukaan"
                Animated.sequence([
                    Animated.delay(350),
                    Animated.stagger(
                        45,
                        letterAnims.map((anim) =>
                            Animated.timing(anim, {
                                toValue: 1,
                                duration: 280,
                                easing: Easing.out(Easing.cubic),
                                useNativeDriver: true,
                            })
                        )
                    ),
                ]),

                // 4. Subtle yellow accent expand beneath brand name
                Animated.sequence([
                    Animated.delay(650),
                    Animated.parallel([
                        Animated.timing(accentOpacity, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(accentScaleX, {
                            toValue: 1,
                            duration: 500,
                            easing: Easing.out(Easing.cubic),
                            useNativeDriver: true,
                        }),
                    ]),
                ]),

                // 5. Tagline reveal
                Animated.sequence([
                    Animated.delay(750),
                    Animated.parallel([
                        Animated.timing(taglineOpacity, {
                            toValue: 1,
                            duration: 550,
                            useNativeDriver: true,
                        }),
                        Animated.timing(taglineTranslateY, {
                            toValue: 0,
                            duration: 550,
                            easing: Easing.out(Easing.quad),
                            useNativeDriver: true,
                        }),
                    ]),
                ]),

                // 6. Bottom loader status
                Animated.sequence([
                    Animated.delay(950),
                    Animated.timing(footerOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();

            // 7. Smooth exit fade transition
            exitTimer = setTimeout(() => {
                if (isMounted) {
                    Animated.timing(screenOpacity, {
                        toValue: 0,
                        duration: 250,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }).start();
                }
            }, 2550);

            // 8. Redirect to products screen at ~2.8 seconds
            navTimer = setTimeout(() => {
                if (isMounted) {
                    router.replace("/products");
                }
            }, 2820);
        });

        return () => {
            isMounted = false;
            if (navTimer) clearTimeout(navTimer);
            if (exitTimer) clearTimeout(exitTimer);
        };
    }, []);

    // Interpolate subtle rotation: -1 -> 0 translates to -3.5deg -> 0deg
    const logoRotationStr = logoRotate.interpolate({
        inputRange: [-1, 0],
        outputRange: ["-3.5deg", "0deg"],
    });

    return (
        <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Centered Brand Presentation */}
            <View style={styles.centerContent}>
                {/* Expanding circular ripple behind the logo */}
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.rippleCircle,
                        {
                            opacity: rippleOpacity,
                            transform: [{ scale: rippleScale }],
                        },
                    ]}
                />

                {/* Logo with smooth scale and subtle rotation */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoOpacity,
                            transform: [
                                { scale: logoScale },
                                { rotate: logoRotationStr },
                            ],
                        },
                    ]}
                >
                    <DukaanLogo size={190} />
                </Animated.View>

                {/* Staggered Letter Reveal for Brand Name */}
                <View style={styles.brandTitleRow}>
                    {BRAND_LETTERS.map((letter, index) => {
                        const letterAnim = letterAnims[index];
                        const translateY = letterAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, 0],
                        });

                        return (
                            <Animated.Text
                                key={`${letter}-${index}`}
                                style={[
                                    styles.brandLetter,
                                    {
                                        opacity: letterAnim,
                                        transform: [{ translateY }],
                                    },
                                ]}
                            >
                                {letter}
                            </Animated.Text>
                        );
                    })}
                </View>

                {/* Yellow accent underline animation */}
                <Animated.View
                    style={[
                        styles.accentUnderline,
                        {
                            opacity: accentOpacity,
                            transform: [{ scaleX: accentScaleX }],
                        },
                    ]}
                />

                {/* Tagline */}
                <Animated.Text
                    style={[
                        styles.tagline,
                        {
                            opacity: taglineOpacity,
                            transform: [{ translateY: taglineTranslateY }],
                        },
                    ]}
                >
                    Your neighbourhood store, reimagined.
                </Animated.Text>
            </View>

            {/* Bottom Loading Status */}
            <Animated.View
                style={[
                    styles.bottomContainer,
                    {
                        opacity: footerOpacity,
                    },
                ]}
            >
                <View style={styles.loadingBadge}>
                    <ActivityIndicator
                        size="small"
                        color={COLORS.primary}
                        style={styles.indicator}
                    />
                    <Text style={styles.loadingText}>Getting your store ready...</Text>
                </View>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // Clean cream #FAF9F6
        justifyContent: "center",
        alignItems: "center",
    },
    centerContent: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 28,
        position: "relative",
    },
    rippleCircle: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 2,
        borderColor: COLORS.accent, // #F2B01E
        backgroundColor: "rgba(242, 176, 30, 0.08)",
        alignSelf: "center",
        top: -15,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    brandTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 6,
    },
    brandLetter: {
        fontFamily: "Outfit_700Bold",
        fontSize: 30,
        color: COLORS.primary,
        letterSpacing: 1.2,
    },
    accentUnderline: {
        width: 44,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: COLORS.accent, // #F2B01E
        marginTop: 6,
        marginBottom: 10,
    },
    tagline: {
        fontFamily: "Outfit_400Regular",
        fontSize: 15.5,
        color: COLORS.secondaryText,
        textAlign: "center",
        letterSpacing: 0.2,
    },
    bottomContainer: {
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    loadingBadge: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: "rgba(15, 61, 46, 0.05)",
    },
    indicator: {
        marginRight: 8,
    },
    loadingText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 13,
        color: COLORS.primary,
        letterSpacing: 0.2,
    },
});