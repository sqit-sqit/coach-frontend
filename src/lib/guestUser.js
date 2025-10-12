/**
 * Guest User Management
 * 
 * Allows users to use the app without authentication by creating
 * a temporary guest ID stored in localStorage.
 */

/**
 * Get existing guest ID or create a new one
 * @returns {string|null} Guest user ID
 */
export function getOrCreateGuestId() {
  if (typeof window === 'undefined') return null;
  
  let guestId = localStorage.getItem('guest_user_id');
  if (!guestId) {
    guestId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guest_user_id', guestId);
    console.log('Created new guest user ID:', guestId);
  }
  return guestId;
}

/**
 * Get the current user ID (authenticated or guest)
 * @param {string|null} authUserId - Authenticated user ID from useAuth
 * @returns {string|null} User ID to use
 */
export function getCurrentUserId(authUserId) {
  return authUserId || getOrCreateGuestId();
}

/**
 * Check if current user is a guest
 * @param {string} userId - User ID to check
 * @returns {boolean} True if user is a guest
 */
export function isGuestUser(userId) {
  return userId && userId.startsWith('guest-');
}

/**
 * Clear guest user data (e.g., on logout or when user registers)
 */
export function clearGuestUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('guest_user_id');
  console.log('Guest user cleared');
}

