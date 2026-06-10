import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../shared/lib/firebase";

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const token = await userCredential.user.getIdToken();

  console.log("🔥 TOKEN:", token);

  return token;
}
