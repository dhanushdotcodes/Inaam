/**
 * Authentication utilities for managing the JWT token in browser cookies.
 */

export const TOKEN_KEY = "inaam_access_token";

/**
 * Get the JWT token from cookies.
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  
  const name = `${TOKEN_KEY}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

/**
 * Save the JWT token to cookies.
 * Sets a cookie with a 24-hour expiration by default.
 */
export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
  const expires = `expires=${d.toUTCString()}`;
  
  document.cookie = `${TOKEN_KEY}=${token};${expires};path=/;SameSite=Strict`;
};

/**
 * Remove the JWT token from cookies.
 */
export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Strict`;
};

/**
 * Check if the user is authenticated (token exists).
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
