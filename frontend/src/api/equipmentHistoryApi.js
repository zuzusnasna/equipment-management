import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export const getEquipmentHistory = async (equipmentId) => {
  const response = await api.get(`/equipments/${equipmentId}/history`);
  return response.data;
};
