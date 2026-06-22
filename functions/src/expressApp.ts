import express from "express";
import cors from "cors";

export const expressApp = express();

expressApp.use(express.json({ limit: "10mb" }));
expressApp.use(express.urlencoded({ extended: true, limit: "10mb" }));

expressApp.use(
  cors({
    origin: ["https://twitter-like-app-ddb7b.web.app"],
    credentials: true,
  }),
);
