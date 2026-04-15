import dotenv from "dotenv";
dotenv.config();
import chalk from "chalk";

import mongoose from "mongoose";

async function ConnectDB() {
        try {
            const connectionInstance = await mongoose.connect(process.env.DB_URL);
            console.log(
  chalk.bgBlue.bold(
    `database connect on host ${connectionInstance.connection.host}`
  )
);
            
        } catch (error) {
            console.log(" Failed to connect database due to error -> " , error )
            process.exit(1)
            
        }
    

}
 export default ConnectDB





