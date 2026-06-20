import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase/firebase";

export const uploadImage = async (file: File) => {
  const fileRef = ref(storage, `posts/${Date.now()}-${file.name}`);

  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
};

export const deleteImage = async (url: string) => {
  const imageRef = ref(storage, url);
  await deleteObject(imageRef);
};
