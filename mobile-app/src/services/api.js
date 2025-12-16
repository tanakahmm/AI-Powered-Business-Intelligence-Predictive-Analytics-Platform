import AsyncStorage from '@react-native-async-storage/async-storage';

// For Android Emulator use "http://10.0.2.2:8080/api"
// For iOS Simulator use "http://localhost:8080/api"
// For Physical Device use your LAN IP e.g. "http://192.168.1.X:8080/api"
const BASE_URL = "http://172.20.10.2:8080/api";

const TIMEOUT = 10000; // 10 seconds

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const token = await AsyncStorage.getItem('userToken');
    console.log("Token from storage:", token ? "Found" : "Missing");

    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log("Authorization header set");
    } else {
      console.log("No token found, skipping Authorization header");
    }

    console.log(`[API] Fetching request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 403) {
        console.error("Access Forbidden: Token might be invalid or missing.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection');
    }
    throw error;
  }
};

export const getDashboardSummary = async () => {
  try {
    return await fetchWithTimeout(`${BASE_URL}/dashboard/summary`);
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw new Error("Failed to load dashboard data. Please try again.");
  }
};

export const predictChurn = async (data) => {
  try {
    return await fetchWithTimeout(`${BASE_URL}/churn/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error("Churn Prediction API Error:", error);
    throw new Error("Failed to predict churn. Please try again.");
  }
};

export const getForecast = async (months) => {
  try {
    return await fetchWithTimeout(
      `${BASE_URL}/forecast/predict?months=${months}`
    );
  } catch (error) {
    console.error("Forecast API Error:", error);
    throw new Error("Failed to load forecast data. Please try again.");
  }
};

export const getStocks = async () => {
  try {
    console.log("Fetching stocks...");
    return await fetchWithTimeout(`${BASE_URL}/stocks`);
  } catch (error) {
    console.error("Stock API Error:", error);
    throw new Error("Failed to load stock data.");
  }
};

export const getNotifications = async () => {
  try {
    return await fetchWithTimeout(`${BASE_URL}/notifications`);
  } catch (error) {
    console.error("Notification API Error:", error);
    throw new Error("Failed to load notifications.");
  }
};

export const markNotificationRead = async (id) => {
  try {
    await fetchWithTimeout(`${BASE_URL}/notifications/${id}/read`, { method: 'PUT' });
  } catch (error) {
    console.error("Notification Read Error:", error);
  }
};

// --- Order API ---

export const getOrders = async () => {
  try {
    return await fetchWithTimeout(`${BASE_URL}/orders/getAllOrders`);
  } catch (error) {
    console.error("Get Orders API Error:", error);
    throw new Error("Failed to load orders.");
  }
};

export const placeOrder = async (orderData) => {
  try {
    return await fetchWithTimeout(`${BASE_URL}/orders/placeOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
  } catch (error) {
    console.error("Place Order API Error:", error);
    throw new Error("Failed to place order.");
  }
};

// --- Report API ---

export const getReports = async () => {
  try {
    return await fetchWithTimeout(`${BASE_URL}/reports/getAll`);
  } catch (error) {
    console.error("Get Reports API Error:", error);
    throw new Error("Failed to load reports.");
  }
};

// --- Product API ---

export const createProduct = async (productData) => {
  try {
    return await fetchWithTimeout(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData)
    });
  } catch (error) {
    console.error("Create Product API Error:", error);
    throw new Error("Failed to create product.");
  }
};

export const getProducts = async () => {
  try {
    return await fetchWithTimeout(`${BASE_URL}/products`);
  } catch (error) {
    console.error("Get Products API Error:", error);
    throw new Error("Failed to load products.");
  }
};
