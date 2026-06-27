import express from "express"
import { userRegisterController, userLoginController, userLogoutController } from "../controller/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, username, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       422:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post("/register", authLimiter, userRegisterController)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
 */
router.post("/login", authLimiter, userLoginController)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout and blacklist token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       400:
 *         description: No token provided
 */
router.post("/logout", userLogoutController)

export default router;