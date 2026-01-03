import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  healthService,
  authService,
  menuService,
  dishService,
  attributeService,
} from './services';
import { apiClient } from './client';
import type {
  HealthResponse,
  AuthResponse,
  RegisterResponse,
  User,
  MessageResponse,
  ApiMenu,
  ApiDish,
  ApiEmotion,
  ApiTexture,
  ApiShape,
} from './types';

// Mock the apiClient
vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    setToken: vi.fn(),
    getToken: vi.fn(),
    isAuthenticated: vi.fn(),
  },
}));

describe('healthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('check', () => {
    it('should call GET /api/health', async () => {
      const mockResponse: HealthResponse = {
        status: 'healthy',
        database: 'connected',
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await healthService.check();

      expect(apiClient.get).toHaveBeenCalledWith('/api/health');
      expect(result).toEqual(mockResponse);
    });
  });
});

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should call POST /auth/register with credentials including email', async () => {
      const mockResponse: RegisterResponse = {
        message: 'User created successfully',
        user_id: 1,
      };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authService.register('testuser', 'test@example.com', 'password123');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('should call POST /auth/login and set token on success', async () => {
      const mockResponse: AuthResponse = {
        access_token: 'jwt-token-123',
        user_id: 1,
      };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authService.login('testuser', 'password123');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        username: 'testuser',
        password: 'password123',
      });
      expect(apiClient.setToken).toHaveBeenCalledWith('jwt-token-123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call POST /auth/logout and clear token', async () => {
      const mockResponse: MessageResponse = {
        message: 'Successfully logged out',
      };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authService.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(apiClient.setToken).toHaveBeenCalledWith(null);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('me', () => {
    it('should call GET /auth/me', async () => {
      const mockUser: User = {
        id: 1,
        username: 'john_doe',
        role: 'user',
        created_at: '2026-01-03T10:30:00+00:00',
        updated_at: '2026-01-03T12:45:00+00:00',
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockUser);

      const result = await authService.me();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateEmail', () => {
    it('should call PATCH /auth/me/email with new email', async () => {
      const mockResponse: MessageResponse = {
        message: 'Email updated successfully',
      };
      vi.mocked(apiClient.patch).mockResolvedValueOnce(mockResponse);

      const result = await authService.updateEmail({ email: 'new@email.com' });

      expect(apiClient.patch).toHaveBeenCalledWith('/auth/me/email', {
        email: 'new@email.com',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updatePassword', () => {
    it('should call PATCH /auth/me/password with passwords', async () => {
      const mockResponse: MessageResponse = {
        message: 'Password updated successfully',
      };
      vi.mocked(apiClient.patch).mockResolvedValueOnce(mockResponse);

      const result = await authService.updatePassword({
        current_password: 'old123',
        new_password: 'new456',
      });

      expect(apiClient.patch).toHaveBeenCalledWith('/auth/me/password', {
        current_password: 'old123',
        new_password: 'new456',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteAccount', () => {
    it('should call DELETE /auth/me with password', async () => {
      const mockResponse: MessageResponse = {
        message: 'Account deleted successfully',
      };
      vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse);

      const result = await authService.deleteAccount({ password: 'mypassword' });

      expect(apiClient.delete).toHaveBeenCalledWith('/auth/me', {
        password: 'mypassword',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('token utilities', () => {
    it('getStoredToken should call apiClient.getToken', () => {
      vi.mocked(apiClient.getToken).mockReturnValueOnce('stored-token');

      const result = authService.getStoredToken();

      expect(apiClient.getToken).toHaveBeenCalled();
      expect(result).toBe('stored-token');
    });

    it('setToken should call apiClient.setToken', () => {
      authService.setToken('new-token');

      expect(apiClient.setToken).toHaveBeenCalledWith('new-token');
    });

    it('isAuthenticated should call apiClient.isAuthenticated', () => {
      vi.mocked(apiClient.isAuthenticated).mockReturnValueOnce(true);

      const result = authService.isAuthenticated();

      expect(apiClient.isAuthenticated).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});

describe('menuService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockMenu: ApiMenu = {
    id: 1,
    title: 'Lunch Menu',
    description: 'Daily lunch specials',
    status: 'draft',
    dish_count: 5,
    created_at: '2026-01-03T10:30:00+00:00',
    updated_at: '2026-01-03T12:45:00+00:00',
  };

  describe('list', () => {
    it('should call GET /api/menus', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce([mockMenu]);

      const result = await menuService.list();

      expect(apiClient.get).toHaveBeenCalledWith('/api/menus');
      expect(result).toEqual([mockMenu]);
    });
  });

  describe('get', () => {
    it('should call GET /api/menus/:id', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockMenu);

      const result = await menuService.get(1);

      expect(apiClient.get).toHaveBeenCalledWith('/api/menus/1');
      expect(result).toEqual(mockMenu);
    });
  });

  describe('create', () => {
    it('should call POST /api/menus with menu data', async () => {
      const mockResponse = { message: 'Menu created', id: 2 };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await menuService.create({
        title: 'Dinner Menu',
        description: 'Evening fine dining',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/api/menus', {
        title: 'Dinner Menu',
        description: 'Evening fine dining',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call PUT /api/menus/:id with update data', async () => {
      const mockResponse: MessageResponse = { message: 'Menu updated' };
      vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse);

      const result = await menuService.update(1, {
        title: 'Updated Title',
        status: 'submitted',
      });

      expect(apiClient.put).toHaveBeenCalledWith('/api/menus/1', {
        title: 'Updated Title',
        status: 'submitted',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('submit', () => {
    it('should call POST /api/menus/:id/submit', async () => {
      const mockResponse: MessageResponse = { message: 'Menu submitted successfully' };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await menuService.submit(1);

      expect(apiClient.post).toHaveBeenCalledWith('/api/menus/1/submit');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should call DELETE /api/menus/:id', async () => {
      const mockResponse: MessageResponse = { message: 'Menu deleted' };
      vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse);

      const result = await menuService.delete(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/api/menus/1');
      expect(result).toEqual(mockResponse);
    });
  });
});

describe('dishService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockDish: ApiDish = {
    id: 1,
    name: 'Spaghetti Carbonara',
    description: 'Classic Roman pasta',
    section: 'Primi',
    emotions: [{ id: 1, description: 'Comfort' }],
    textures: [{ id: 1, description: 'Creamy' }],
    shapes: [{ id: 1, description: 'Long' }],
    bitter: 0,
    salty: 3,
    sour: 1,
    sweet: 0,
    umami: 5,
    fat: 4,
    piquant: 1,
    temperature: 4,
    colors: ['#F5DEB3', '#FFD700'],
    created_at: '2026-01-03T10:30:00+00:00',
    updated_at: '2026-01-03T12:45:00+00:00',
  };

  describe('listByMenu', () => {
    it('should call GET /api/menus/:menuId/dishes', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce([mockDish]);

      const result = await dishService.listByMenu(1);

      expect(apiClient.get).toHaveBeenCalledWith('/api/menus/1/dishes');
      expect(result).toEqual([mockDish]);
    });
  });

  describe('create', () => {
    it('should call POST /api/menus/:menuId/dishes with dish data', async () => {
      const mockResponse = { message: 'Dish created', id: 5 };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const createData = {
        name: 'Margherita Pizza',
        description: 'Traditional Neapolitan pizza',
        section: 'Pizze',
        bitter: 0,
        salty: 2,
        sour: 2,
        sweet: 1,
        umami: 4,
        fat: 3,
        piquant: 0,
        temperature: 5,
        color1: '#FF6347',
        emotion_ids: [1, 2],
        texture_ids: [3],
        shape_ids: [2],
      };

      const result = await dishService.create(1, createData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/menus/1/dishes', createData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call PUT /api/dishes/:dishId with update data', async () => {
      const mockResponse: MessageResponse = { message: 'Dish updated' };
      vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse);

      const result = await dishService.update(1, { name: 'Updated Dish', salty: 4 });

      expect(apiClient.put).toHaveBeenCalledWith('/api/dishes/1', {
        name: 'Updated Dish',
        salty: 4,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should call DELETE /api/dishes/:dishId', async () => {
      const mockResponse: MessageResponse = { message: 'Dish deleted' };
      vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse);

      const result = await dishService.delete(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/api/dishes/1');
      expect(result).toEqual(mockResponse);
    });
  });
});

describe('attributeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEmotions', () => {
    it('should call GET /api/emotions', async () => {
      const mockEmotions: ApiEmotion[] = [
        { id: 1, description: 'Happy' },
        { id: 2, description: 'Nostalgic' },
      ];
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockEmotions);

      const result = await attributeService.getEmotions();

      expect(apiClient.get).toHaveBeenCalledWith('/api/emotions');
      expect(result).toEqual(mockEmotions);
    });
  });

  describe('getTextures', () => {
    it('should call GET /api/textures', async () => {
      const mockTextures: ApiTexture[] = [
        { id: 1, description: 'Crunchy' },
        { id: 2, description: 'Smooth' },
      ];
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockTextures);

      const result = await attributeService.getTextures();

      expect(apiClient.get).toHaveBeenCalledWith('/api/textures');
      expect(result).toEqual(mockTextures);
    });
  });

  describe('getShapes', () => {
    it('should call GET /api/shapes', async () => {
      const mockShapes: ApiShape[] = [
        { id: 1, description: 'Round' },
        { id: 2, description: 'Square' },
      ];
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockShapes);

      const result = await attributeService.getShapes();

      expect(apiClient.get).toHaveBeenCalledWith('/api/shapes');
      expect(result).toEqual(mockShapes);
    });
  });
});
