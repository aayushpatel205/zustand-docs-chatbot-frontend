// context/authStore.js
import { create } from "zustand";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../Service/authService";
import { saveTokens, getAccessToken, clearTokens } from "../Utils/tokenStorage";

const useAuthStore = create((set, get) => ({
  // ─── State ───────────────────────────────────────────────────────────────────
  user: null,
  accessToken: null, // ✅ no refreshToken here — backend owns it via cookie
  isLoading: false,
  isHydrated: false,

  // ─── Hydrate ─────────────────────────────────────────────────────────────────
  hydrate: async () => {
    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        return;
      }

      set({ accessToken });

      const { user } = await getCurrentUser();

      set({ user });
    } catch (error) {
      await clearTokens();
      set({ user: null, accessToken: null });
    } finally {
      set({ isHydrated: true });
    }
  },

  // ─── Login ───────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const result = await loginUser(email, password);

      const { accessToken, refreshToken, user } = result;

      await saveTokens(accessToken, refreshToken);

      // verify it was actually saved
      const saved = await getAccessToken();

      set({ user, accessToken });
    } catch (error) {
      console.log("Login error:", error.message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── Register ────────────────────────────────────────────────────────────────
  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      await registerUser(name, email, password);
      // auto-login after registration
      await get().login(email, password);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── Logout ──────────────────────────────────────────────────────────────────
  logout: async () => {
    set({ isLoading: true });
    try {
      // backend clears the httpOnly cookie + invalidates token in AstraDB
      await logoutUser().catch(() => {}); // best effort
    } finally {
      await clearTokens();
      set({
        user: null,
        accessToken: null,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
