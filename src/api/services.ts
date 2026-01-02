import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import {
  ApiMenu,
  ApiDish,
  ApiEmotion,
  ApiTexture,
  ApiShape,
  AuthResponse,
  RegisterResponse,
  User,
  CreateMenuRequest,
  CreateDishRequest,
  UpdateDishRequest,
  HealthResponse,
} from './types';

// Health check
export const healthService = {
  check: () => apiClient.get<HealthResponse>(API_ENDPOINTS.health),
};

// Authentication services
export const authService = {
  register: (username: string, password: string) =>
    apiClient.post<RegisterResponse>(API_ENDPOINTS.register, { username, password }),

  login: async (username: string, password: string) => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.login, { username, password });
    apiClient.setToken(response.access_token);
    return response;
  },

  logout: async () => {
    const response = await apiClient.post<{ message: string }>(API_ENDPOINTS.logout);
    apiClient.setToken(null);
    return response;
  },

  me: () => apiClient.get<User>(API_ENDPOINTS.me),

  getStoredToken: () => apiClient.getToken(),

  setToken: (token: string | null) => apiClient.setToken(token),

  isAuthenticated: () => apiClient.isAuthenticated(),
};

// Menu services
export const menuService = {
  list: () => apiClient.get<ApiMenu[]>(API_ENDPOINTS.menus),

  get: (id: number) => apiClient.get<ApiMenu>(API_ENDPOINTS.menu(id)),

  create: (data: CreateMenuRequest) =>
    apiClient.post<{ message: string; id: number }>(API_ENDPOINTS.menus, data),

  update: (id: number, data: Partial<CreateMenuRequest>) =>
    apiClient.put<{ message: string }>(API_ENDPOINTS.menu(id), data),

  delete: (id: number) =>
    apiClient.delete<{ message: string }>(API_ENDPOINTS.menu(id)),
};

// Dish services
export const dishService = {
  listByMenu: (menuId: number) =>
    apiClient.get<ApiDish[]>(API_ENDPOINTS.menuDishes(menuId)),

  create: (menuId: number, data: CreateDishRequest) =>
    apiClient.post<{ message: string; id: number }>(API_ENDPOINTS.menuDishes(menuId), data),

  update: (dishId: number, data: UpdateDishRequest) =>
    apiClient.put<{ message: string }>(API_ENDPOINTS.dish(dishId), data),

  delete: (dishId: number) =>
    apiClient.delete<{ message: string }>(API_ENDPOINTS.dish(dishId)),
};

// Attribute services
export const attributeService = {
  getEmotions: () => apiClient.get<ApiEmotion[]>(API_ENDPOINTS.emotions),
  getTextures: () => apiClient.get<ApiTexture[]>(API_ENDPOINTS.textures),
  getShapes: () => apiClient.get<ApiShape[]>(API_ENDPOINTS.shapes),
};
