# Dukaan — Mini Shopping App

> **Repository:** [https://github.com/tarunkulkarni4/dukaan-react-native-shopping-app](https://github.com/tarunkulkarni4/dukaan-react-native-shopping-app)

Dukaan is a shopping app built with **React Native** and **Expo** as part of a frontend development assignment.

The goal was to create a clean, modern mobile shopping experience where users can browse products, search by name, filter by category, view detailed product information, and manage their shopping cart with persistent local storage.

---

## ✨ Features

* **Product Listing:** Browse items fetched live from FakeStore API with high-quality images, category tags, and Indian Rupee (₹) pricing.
* **Skeleton Shimmer Loading:** Smooth animated skeleton placeholders with breathing shimmer that preserve layout geometry during API fetch.
* **Real-time Search:** Search products by title in real time with instant filtering and a quick-clear (`×`) button.
* **Category Filters:** Filter by categories (*All*, *Men's Clothing*, *Women's Clothing*, *Electronics*, *Jewelry*) via quick chips or a bottom-sheet modal.
* **Combined Search & Filter:** Search query and category filter work seamlessly together with an empty-state fallback.
* **Product Details:** Dedicated screen displaying high-resolution images, descriptions, ratings, price breakdown, and quantity selector.
* **Animated Success Toast:** Custom floating toast notification with checkmark that animates above the bottom bar on Add to Cart, resetting cleanly on rapid taps.
* **Live Cart Badge:** Header shopping cart icon with live badge counter reflecting the current cart size.
* **Shopping Cart Management:** Increase/decrease item quantities (guarded minimum of 1), remove items, and view live subtotal calculations.
* **Persistent Cart Storage:** Automatically saves cart items to device storage using `@react-native-async-storage/async-storage` with hydration locks to avoid data loss on app restarts.
* **Detailed Checkout Order Summary:** Bottom-sheet checkout modal detailing all cart products with thumbnails, unit prices, quantities, line totals, delivery charges, and grand total.
* **Simulated Order Confirmation:** Complete simulated checkout flow generating a reference ID and detailed purchase receipt with a "Continue Shopping" button.
* **Cinematic App Launch:** Smooth splash screen animation featuring Dukaan logo entrance, ripple effect, staggered brand name reveal, and golden accent line.

---

## 🛠️ Technologies Used

* **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 58)
* **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
* **State Management:** React Context API (`CartContext`)
* **Local Persistence:** `@react-native-async-storage/async-storage`
* **Icons & Graphics:** `react-native-svg` (Clean vector SVGs)
* **Typography:** `@expo-google-fonts/outfit` (Outfit Regular, Medium, SemiBold, Bold)
* **API:** [Fake Store API](https://fakestoreapi.com/)
* **Build Tooling:** EAS Build (Expo Application Services)

---

## 🚀 How to Run the Project

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [Expo Go](https://expo.dev/go) app installed on your Android or iOS device, or an Android/iOS emulator.

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tarunkulkarni4/dukaan-react-native-shopping-app.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd dukaan-react-native-shopping-app
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

5. **Run on your device:**
   * **Android / iOS:** Scan the QR code displayed in the terminal using the **Expo Go** app.
   * **Web:** Press `w` in the terminal to open in your browser.

---

## 📦 Building Android APK (EAS Build)

This project is configured with `eas.json` to build standalone Android APKs:

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build a standalone preview APK
eas build --platform android --profile preview
```

---

## 💡 About the Project

This project was built to demonstrate core frontend mobile engineering concepts:
* Clean component architecture and custom design systems.
* Managing global state and asynchronous persistent storage.
* Graceful network state handling (skeletons, error banners, retries).
* Native 60 FPS animations and tactile microinteractions.
* End-to-end simulated checkout flows and responsive layout across devices.

> **Note:** The checkout process is a demonstration feature designed for testing the shopping flow. It does not process real payments or require real banking credentials.
