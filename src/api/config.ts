// API Configuration
export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Health
  health: '/api/health',

  // Auth
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  me: '/auth/me',

  // Menus
  menus: '/api/menus',
  menu: (id: number) => `/api/menus/${id}`,

  // Dishes
  menuDishes: (menuId: number) => `/api/menus/${menuId}/dishes`,
  dish: (id: number) => `/api/dishes/${id}`,

  // Attributes
  emotions: '/api/emotions',
  textures: '/api/textures',
  shapes: '/api/shapes',
} as const;
