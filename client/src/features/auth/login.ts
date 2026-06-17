import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../shared/lib/firebase";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const token = await userCredential.user.getIdToken();

  return token;
}

export const createPost = async () => {
  const token = await login("priymak17ukrvaha@gmail.com", "12345678");

  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: "text post", text: "test post" }),
  });

  console.log(await res.json());
};
