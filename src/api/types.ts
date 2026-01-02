// API Types matching the new SoundFood API

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user_id: number;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
}

export interface ApiMenu {
  id: number;
  title: string;
  description: string;
  dish_count?: number;
  dishes?: ApiDish[];
}

export interface ApiEmotion {
  id: number;
  description: string;
}

export interface ApiTexture {
  id: number;
  description: string;
}

export interface ApiShape {
  id: number;
  description: string;
}

export interface ApiDish {
  id: number;
  name: string;
  description: string;
  section: string;
  emotions: ApiEmotion[];
  textures: ApiTexture[];
  shapes: ApiShape[];
  bitter: number;
  salty: number;
  sour: number;
  sweet: number;
  umami: number;
  fat: number;
  piquant: number;
  temperature: number;
  colors: string[];
}

export interface CreateDishRequest {
  name: string;
  description?: string;
  section: string;
  bitter: number;
  salty: number;
  sour: number;
  sweet: number;
  umami: number;
  fat: number;
  piquant: number;
  temperature: number;
  color1?: string;
  color2?: string;
  color3?: string;
  emotion_ids: number[];
  texture_ids: number[];
  shape_ids: number[];
}

export interface UpdateDishRequest {
  name?: string;
  description?: string;
  section?: string;
  bitter?: number;
  salty?: number;
  sour?: number;
  sweet?: number;
  umami?: number;
  fat?: number;
  piquant?: number;
  temperature?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  emotion_ids?: number[];
  texture_ids?: number[];
  shape_ids?: number[];
}

export interface CreateMenuRequest {
  title: string;
  description?: string;
}

export interface ApiError {
  error: string;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  database: 'connected' | 'disconnected';
}
