import axios from "axios";

export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export const getMenu = () => axios.get(`${API_BASE}/api/menu`);
export const placeOrder = (data) => axios.post(`${API_BASE}/api/orders`, data);
export const getOrder = (id) => axios.get(`${API_BASE}/api/orders/${id}`);
export const getAllOrders = () => axios.get(`${API_BASE}/api/orders`);