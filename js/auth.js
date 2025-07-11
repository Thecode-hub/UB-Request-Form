import { getAuth, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

// Initialize auth
const auth = getAuth();

/**
 * Logs out the current user and returns a Promise.
 */
export async function logout() {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}

/**
 * Changes the password for the current user after re-authenticating.
 * @param {string} currentPassword - The user's current password.
 * @param {string} newPassword - The new password to set.
 */
export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("No authenticated user found.");
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    console.log("Password changed successfully.");
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}