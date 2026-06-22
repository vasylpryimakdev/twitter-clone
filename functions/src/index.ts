import * as functions from "firebase-functions";
import { bootstrap } from "./bootstrap";
import { expressApp } from "./expressApp";

let initialized = false;

export const api = functions.https.onRequest(async (req, res) => {
  if (!initialized) {
    await bootstrap();
    initialized = true;
  }

  return expressApp(req, res);
});
