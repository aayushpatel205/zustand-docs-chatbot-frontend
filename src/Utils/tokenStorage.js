// utils/tokenStorage.js
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
};

export const saveTokens = async (accessToken, refreshToken) => {
  await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);
  }
};

export const getAccessToken = () =>
  SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);

export const getRefreshToken = () =>             
  SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN); // ← clear both
};