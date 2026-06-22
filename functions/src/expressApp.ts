import express from "express";

export const expressApp = express();

expressApp.use(express.json({ limit: "10mb" }));
expressApp.use(express.urlencoded({ extended: true, limit: "10mb" }));
