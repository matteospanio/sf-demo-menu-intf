import { describe, it, expect } from 'vitest';
import { API_BASE_URL, API_ENDPOINTS } from './config';

describe('API Configuration', () => {
  describe('API_BASE_URL', () => {
    it('should have a default value', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe('string');
    });
  });

  describe('API_ENDPOINTS', () => {
    describe('Health endpoints', () => {
      it('should define health endpoint', () => {
        expect(API_ENDPOINTS.health).toBe('/api/health');
      });
    });

    describe('Auth endpoints', () => {
      it('should define register endpoint', () => {
        expect(API_ENDPOINTS.register).toBe('/auth/register');
      });

      it('should define login endpoint', () => {
        expect(API_ENDPOINTS.login).toBe('/auth/login');
      });

      it('should define logout endpoint', () => {
        expect(API_ENDPOINTS.logout).toBe('/auth/logout');
      });

      it('should define me endpoint', () => {
        expect(API_ENDPOINTS.me).toBe('/auth/me');
      });

      it('should define meEmail endpoint', () => {
        expect(API_ENDPOINTS.meEmail).toBe('/auth/me/email');
      });

      it('should define mePassword endpoint', () => {
        expect(API_ENDPOINTS.mePassword).toBe('/auth/me/password');
      });
    });

    describe('Menu endpoints', () => {
      it('should define menus endpoint', () => {
        expect(API_ENDPOINTS.menus).toBe('/api/menus');
      });

      it('should generate menu endpoint with id', () => {
        expect(API_ENDPOINTS.menu(1)).toBe('/api/menus/1');
        expect(API_ENDPOINTS.menu(42)).toBe('/api/menus/42');
      });

      it('should generate menuSubmit endpoint with id', () => {
        expect(API_ENDPOINTS.menuSubmit(1)).toBe('/api/menus/1/submit');
        expect(API_ENDPOINTS.menuSubmit(42)).toBe('/api/menus/42/submit');
      });
    });

    describe('Dish endpoints', () => {
      it('should generate menuDishes endpoint with menuId', () => {
        expect(API_ENDPOINTS.menuDishes(1)).toBe('/api/menus/1/dishes');
        expect(API_ENDPOINTS.menuDishes(42)).toBe('/api/menus/42/dishes');
      });

      it('should generate dish endpoint with id', () => {
        expect(API_ENDPOINTS.dish(1)).toBe('/api/dishes/1');
        expect(API_ENDPOINTS.dish(42)).toBe('/api/dishes/42');
      });
    });

    describe('Attribute endpoints', () => {
      it('should define emotions endpoint', () => {
        expect(API_ENDPOINTS.emotions).toBe('/api/emotions');
      });

      it('should define textures endpoint', () => {
        expect(API_ENDPOINTS.textures).toBe('/api/textures');
      });

      it('should define shapes endpoint', () => {
        expect(API_ENDPOINTS.shapes).toBe('/api/shapes');
      });
    });
  });
});
