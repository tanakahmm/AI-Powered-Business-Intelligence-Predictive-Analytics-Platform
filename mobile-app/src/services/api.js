const BASE_URL = "http://192.168.1.4:8080/api";
const TIMEOUT = 10000; // 10 seconds

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
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
