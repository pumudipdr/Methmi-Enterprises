import { asyncRoute } from "../lib/http.js";
import { Router } from "express";
import { getAllTours, getAllVehicles } from "../lib/content-store.js";

const router = Router();

function readLimit(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n <= 50 ? n : undefined;
}

router.get("/tours", asyncRoute(async (req, res) => {
  res.json({ tours: await getAllTours(readLimit(req.query.limit)) });
}));

router.get("/vehicles", asyncRoute(async (req, res) => {
  res.json({ vehicles: await getAllVehicles(readLimit(req.query.limit)) });
}));

export default router;