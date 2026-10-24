/**
 * Currency conversion and formatting utilities for Dukaan
 * Demonstration exchange rate: 1 USD = ₹90
 */

export const USD_TO_INR_RATE = 90;

/**
 * Converts a USD price to Indian Rupees (INR)
 * @param {number|string} usdPrice - Price in USD
 * @returns {number} Converted price in INR
 */
export function convertToINR(usdPrice) {
    const price = Number(usdPrice) || 0;
    return price * USD_TO_INR_RATE;
}

/**
 * Formats an amount using Indian numbering system and Rupee currency symbol (₹)
 * Examples:
 *   900 -> "₹900"
 *   2295 -> "₹2,295"
 *   5039.10 -> "₹5,039.10"
 * @param {number|string} amount - Amount in INR
 * @returns {string} Formatted INR currency string
 */
export function formatINR(amount) {
    const num = Number(amount) || 0;
    const isInteger = Number.isInteger(num);

    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: isInteger ? 0 : 2,
            maximumFractionDigits: 2,
        }).format(num);
    } catch (e) {
        // Fallback for environments where Intl currency option is limited
        const formatted = isInteger
            ? Math.round(num).toLocaleString("en-IN")
            : num.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              });
        return `₹${formatted}`;
    }
}

/**
 * Convenience helper that converts USD price to INR and formats it in one step
 * @param {number|string} usdPrice - Price in USD
 * @returns {string} Formatted INR currency string
 */
export function formatUSDToINR(usdPrice) {
    return formatINR(convertToINR(usdPrice));
}
