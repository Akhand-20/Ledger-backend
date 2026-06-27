import express from "express";
import { createTransaction as createTransactionController} from "../controller/transaction.controller.js";
import { authMiddleware, systemUserMiddleware } from "../middleware/auth.middleware.js";
import { createInitialFundTransaction as createInitialFundTransactionController} from "../controller/initialFunds.controller.js";
import { getTransactionHistory } from "../controller/accountHistory.controller.js";
import { reverseTransaction } from "../controller/transaction.reverse.controller.js";

const router = express.Router()

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction between two accounts
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromAccountId, toAccountId, amount, idempotencyKey]
 *             properties:
 *               fromAccountId:
 *                 type: string
 *                 example: 6a387060504688e91634961e
 *               toAccountId:
 *                 type: string
 *                 example: 6a3861e3e1ace85d759cc424
 *               amount:
 *                 type: number
 *                 example: 500
 *               idempotencyKey:
 *                 type: string
 *                 example: 019ef167-6b54-7d7b-a871-750aa6d1f34b
 *     responses:
 *       201:
 *         description: Transaction completed successfully
 *       400:
 *         description: Insufficient balance or invalid accounts
 *       500:
 *         description: Transaction failed
 */
//this api wil be POST /api/transactions
//~~>create a new transaction
router.post("/", authMiddleware, createTransactionController)

/**
 * @swagger
 * /api/transactions/system/initial-fund:
 *   post:
 *     summary: Seed initial funds to a user account (system users only)
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [toAccountId, amount, idempotencyKey]
 *             properties:
 *               toAccountId:
 *                 type: string
 *                 example: 6a3861e3e1ace85d759cc424
 *               amount:
 *                 type: number
 *                 example: 10000
 *               idempotencyKey:
 *                 type: string
 *                 example: 019ef167-6b54-7d7b-a871-750aa6d1f34b
 *     responses:
 *       201:
 *         description: Initial funds transaction completed successfully
 *       403:
 *         description: Forbidden - system users only
 *       404:
 *         description: Account not found
 *       500:
 *         description: Transaction failed
 */
router.post("/system/initial-fund", systemUserMiddleware, createInitialFundTransactionController)

/**
 * @swagger
 * /api/transactions/{accountId}/history:
 *   get:
 *     summary: Get paginated transaction history for an account
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB account ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Results per page (default 10)
 *     responses:
 *       200:
 *         description: Paginated transaction history
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
router.get("/:accountId/history", authMiddleware, getTransactionHistory)

/**
 * @swagger
 * /api/transactions/{transactionId}/reverse:
 *   post:
 *     summary: Reverse a completed transaction (system users only)
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB transaction ID
 *     responses:
 *       200:
 *         description: Transaction reversed successfully
 *       400:
 *         description: Only completed transactions can be reversed
 *       403:
 *         description: Forbidden - system users only
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Reversal failed
 */
//reverse transaction
router.post("/:transactionId/reverse", systemUserMiddleware, reverseTransaction)

export default router