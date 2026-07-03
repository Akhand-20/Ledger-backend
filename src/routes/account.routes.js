import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createAccount as createAccountContoller, getUserAccount as getUserAccountController,
    getAccountBalance as getAccountBalanceController, updateAccountStatus as updateAccountStatusController,
    findAccountByUsername as findAccountByUsernameController
} from '../controller/account.controller.js'

const router = express.Router()

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currency:
 *                 type: string
 *                 example: INR
 *     responses:
 *       201:
 *         description: Account created successfully
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, createAccountContoller)

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts for logged in user
 *     tags: [Accounts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getUserAccountController)

/**
 * @swagger
 * /api/accounts/balance/{accountId}:
 *   get:
 *     summary: Get balance for a specific account
 *     tags: [Accounts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB account ID
 *     responses:
 *       200:
 *         description: Account balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountId:
 *                   type: string
 *                 balance:
 *                   type: number
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
router.get("/balance/:accountId", authMiddleware, getAccountBalanceController)

/**
 * @swagger
 * /api/accounts/find/{username}:
 *   get:
 *     summary: Find an account by username (for sending money)
 *     tags: [Accounts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the recipient
 *     responses:
 *       200:
 *         description: Account found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 accountId:
 *                   type: string
 *       404:
 *         description: User or account not found
 *       500:
 *         description: Server error
 */
router.get("/find/:username", authMiddleware, findAccountByUsernameController)

/**
 * @swagger
 * /api/accounts/{accountId}/status:
 *   patch:
 *     summary: Update account status (freeze or close)
 *     tags: [Accounts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, FROZEN, CLOSED]
 *                 example: FROZEN
 *     responses:
 *       200:
 *         description: Account status updated successfully
 *       400:
 *         description: Invalid status or closed account cannot be modified
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
router.patch("/:accountId/status", authMiddleware, updateAccountStatusController)

export default router