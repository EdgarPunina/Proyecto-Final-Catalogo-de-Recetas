const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const getStoredToken = () => localStorage.getItem('recipe_token');

const clearSession = () => {
  localStorage.removeItem('recipe_token');
  localStorage.removeItem('recipe_user');
};

const request = async (endpoint, options = {}) => {
  const token = getStoredToken();
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
      if (endpoint !== '/login' && endpoint !== '/register') window.location.replace('/login');
    }

    const message = payload?.errors
      ? Object.values(payload.errors).flat().join(' ')
      : payload?.message || 'Ha ocurrido un error inesperado.';

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload?.data ?? payload;
};

const api = {
  async register(data) {
    return request('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data) {
    return request('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout() {
    try {
      await request('/logout', {
        method: 'POST',
      });
    } finally {
      clearSession();
    }
  },

  async getRecipes() {
    return request('/recipes');
  },

  async getRecipe(id) {
    return request(`/recipes/${id}`);
  },

  async createRecipe(data) {
    return request('/recipes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateRecipe(id, data) {
    return request(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteRecipe(id) {
    return request(`/recipes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default api;
