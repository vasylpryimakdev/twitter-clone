import * as functions from "firebase-functions";
import { bootstrap } from "./bootstrap";

export const api = functions.https.onRequest(async (req, res) => {
  const app = await bootstrap();
  return app(req, res);
});
