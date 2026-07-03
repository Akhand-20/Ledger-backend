import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Backend Ledger API",
            version: "1.0.0",
            description: "A double-entry ledger system with JWT authentication, idempotent transactions, and atomic MongoDB sessions"
        },
        servers: [
            {
                url: "https://your-app-name.onrender.com",
                description: "Production server"
            },
            {
                url: "http://localhost:3000",
                description: "Development server"
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token"
                }
            }
        }
    },
    apis: ["./src/routes/*.js"]
}

export const swaggerSpec = swaggerJsdoc(options);