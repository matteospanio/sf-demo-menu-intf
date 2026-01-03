import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, ApiError } from './client';

describe('ApiClient', () => {
  const mockFetch = vi.fn();
  const mockLocalStorage: Record<string, string> = {};

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);

    // Mock localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage[key];
      }),
      clear: vi.fn(() => {
        Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]);
      }),
    });

    // Clear mock storage
    Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]);
    apiClient.setToken(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    mockFetch.mockReset();
  });

  describe('token management', () => {
    it('should store token when set', () => {
      apiClient.setToken('test-token');

      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token');
      expect(apiClient.getToken()).toBe('test-token');
    });

    it('should remove token when set to null', () => {
      apiClient.setToken('test-token');
      apiClient.setToken(null);

      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(apiClient.getToken()).toBeNull();
    });

    it('should report authentication status correctly', () => {
      expect(apiClient.isAuthenticated()).toBe(false);

      apiClient.setToken('test-token');
      expect(apiClient.isAuthenticated()).toBe(true);

      apiClient.setToken(null);
      expect(apiClient.isAuthenticated()).toBe(false);
    });
  });

  describe('GET requests', () => {
    it('should make a GET request with correct headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      await apiClient.get('/api/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should include Authorization header when token is set', async () => {
      apiClient.setToken('bearer-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      await apiClient.get('/api/protected');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer bearer-token',
          }),
        })
      );
    });

    it('should return parsed JSON response', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await apiClient.get<typeof mockData>('/api/test');

      expect(result).toEqual(mockData);
    });
  });

  describe('POST requests', () => {
    it('should make a POST request with JSON body', async () => {
      const requestData = { username: 'test', password: 'password' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'success' }),
      });

      await apiClient.post('/auth/login', requestData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      );
    });

    it('should make a POST request without body when data is undefined', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'success' }),
      });

      await apiClient.post('/api/submit');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        })
      );
    });
  });

  describe('PUT requests', () => {
    it('should make a PUT request with JSON body', async () => {
      const updateData = { title: 'Updated Title' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'updated' }),
      });

      await apiClient.put('/api/menus/1', updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/menus/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      );
    });
  });

  describe('PATCH requests', () => {
    it('should make a PATCH request with JSON body', async () => {
      const patchData = { email: 'new@email.com' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'patched' }),
      });

      await apiClient.patch('/auth/me/email', patchData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me/email'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(patchData),
        })
      );
    });
  });

  describe('DELETE requests', () => {
    it('should make a DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'deleted' }),
      });

      await apiClient.delete('/api/menus/1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/menus/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should make a DELETE request with body when data is provided', async () => {
      const deleteData = { password: 'confirm-password' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'deleted' }),
      });

      await apiClient.delete('/auth/me', deleteData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify(deleteData),
        })
      );
    });
  });

  describe('error handling', () => {
    it('should throw ApiError on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      await expect(apiClient.get('/api/protected')).rejects.toThrow(ApiError);
    });

    it('should include status code in ApiError', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });

      try {
        await apiClient.get('/api/missing');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
        expect((error as ApiError).message).toBe('Not found');
      }
    });

    it('should handle JSON parse errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(apiClient.get('/api/error')).rejects.toThrow(ApiError);
    });

    it('should use default error message when error field is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({}),
      });

      try {
        await apiClient.get('/api/bad-request');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Request failed');
      }
    });
  });
});

describe('ApiError', () => {
  it('should create error with status and message', () => {
    const error = new ApiError(404, 'Resource not found');

    expect(error.status).toBe(404);
    expect(error.message).toBe('Resource not found');
    expect(error.name).toBe('ApiError');
  });

  it('should be an instance of Error', () => {
    const error = new ApiError(500, 'Server error');

    expect(error).toBeInstanceOf(Error);
  });
});
