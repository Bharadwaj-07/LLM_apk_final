import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated ,LogBox} from "react-native";

const SplashScreen = ({ navigation }) => {
    const fadeAnim = new Animated.Value(0);
    LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);
    useEffect(() => {
        // Fade-in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();

        // Navigate after 3 seconds
        setTimeout(() => {
            navigation.replace("Login"); // Change "Home" to your main screen
        }, 5000);
    }, []);

    return (
        <View style={styles.container}>
            {/* Gradient Background using Overlay */}
            <View style={styles.gradientBackground} />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Logo />
                <Text style={styles.title}>EduSync</Text>
            </Animated.View>
        </View>
    );
};

// Minimal Logo Component
const Logo = () => (
    <View style={styles.logoContainer}>
        <Text style={styles.logoText}>📘🔄</Text> {/* Emoji-based logo */}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3C0A6B", // Base color
    },
    gradientBackground: {
        ...StyleSheet.absoluteFillObject, // Fills the entire screen
        backgroundColor: "transparent",
        opacity: 0.4, // Adjust transparency
        zIndex: -1,
    },
    content: {
        alignItems: "center",
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#FFF",
        marginTop: 10,
    },
    logoContainer: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 50,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 40,
    },
});

export default SplashScreen;