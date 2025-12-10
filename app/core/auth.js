import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile   
} from "firebase/auth";

export async function createAccount(name, email, password) {
  try {
    let result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, {
      displayName: name,
    });

    await sendEmailVerification(result.user);

    return result;
  } catch (error) {
    console.log(error);
  }
}


export async function login(email, password) {
  try {
    let result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.log(error);
  }
}


export async function logout() {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    return true;
  } catch (error) {
    console.error("Logout failed:", error.message);
    alert("Logout failed: " + error.message);
    return false;
  }
}


export async function resetEmail(email) {
  return await sendPasswordResetEmail(auth, email);
}
