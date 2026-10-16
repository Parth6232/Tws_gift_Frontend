/**
 * Local store helper for non-sensitive client preferences
 */
export const localStore = {
  getUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch {
      // ignore
    }
  },
  removeUser: () => {
    try {
      localStorage.removeItem('user');
    } catch {
      // ignore
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  },
};
