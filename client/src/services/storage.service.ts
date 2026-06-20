import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase/firebase";

export const uploadImage = async (file: File) => {
  const path = `posts/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);

  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);

  return {
    url,
    path,
  };
};

export const deleteImage = async (path: string) => {
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
};
