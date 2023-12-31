import express from "express";
import { test, signup, login, update } from "../controllers/userContol.js";
import protectRoute from "../middleware/protectedRoutes.js";

const router = express.Router();

router.get("/test", test);
router.post("/signup", signup);
router.post("/login", login);
router.post("/update/:id", protectRoute, update);

export default router;
