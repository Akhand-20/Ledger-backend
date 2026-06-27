import dotenv from 'dotenv'//so that env is loaded first
dotenv.config();//load environment variable from .env file 

import  app  from "./src/app.js";
import connectDB from "./src/config/dbConfig.js";

connectDB();

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})