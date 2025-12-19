const API_BASE_URL = 'http://localhost:8080/api/users';

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'Login failed');
  }

  return data;
};

export const signup = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}?action=register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'Signup failed');
  }

  return data;
};

