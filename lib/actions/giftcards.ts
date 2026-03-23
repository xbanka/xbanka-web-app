import AxiosInstance from "../AxiosInstance/AxiosInstance";

export const getAvailableGiftCards = async() => {
  const response = await AxiosInstance.get("/gift-cards");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getGiftCardsCategories = async() => {
  const response = await AxiosInstance.get("/gift-cards/categories");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getGiftCardsRegions = async() => {
  const response = await AxiosInstance.get("/gift-cards/regions");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getGiftCardsStream = async() => {
  const response = await AxiosInstance.get("/gift-cards/stream");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};