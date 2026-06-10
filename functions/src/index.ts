import * as functions from "firebase-functions";
import { createNestServer } from "./main";

let server: any;

export const api = functions.https.onRequest(async (req, res) => {
  if (!server) {
    server = await createNestServer();
  }

  return server(req, res);
});
