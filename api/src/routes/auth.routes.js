import { Router } from "express";
import { resgistro, login } from "../controllers/auth.controller.js";

const router = Router();

router.post('/registro', resgistro);
router.post('/login', login);

export default router;