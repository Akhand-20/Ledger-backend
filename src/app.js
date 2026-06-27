import express from "express"
import authRouter from "./routes/auth.routes.js"
import accountRouter from "./routes/account.routes.js"
import transactionRouter from "./routes/transactions.routes.js"
import cookieParser from "cookie-parser"
import helmet from "helmet";
import morgan from "morgan";
import {errorHandler} from "./middleware/errorHandler.middleware.js"
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app=express()

app.use(express.json())//to read.body

app.use(cookieParser());

app.use(helmet());//sets http headers for security

app.use(morgan("dev"));//logs http requests to console

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRouter)

app.use(errorHandler)

export default app
