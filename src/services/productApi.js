const BASE_URL = "https://fakestoreapi.com";

// Fetch ALL products
export const getProducts = async () => {
    const response = await fetch(`${BASE_URL}/products`);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return await response.json();
};

// Fetch ONE product using its ID
export const getProductById = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch product details");
    }

    return await response.json();
};