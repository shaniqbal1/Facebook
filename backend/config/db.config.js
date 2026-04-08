import chalk from "chalk";
import mongoose from "mongoose";

async function ConnectDB() {
        try {
            const connectionInstance = await mongoose.connect(process.env.DB_URL);
            console.log(chalk.bgBlue.bold('database connect on host $( connectionInstance'))
            
        } catch (error) {
            console.log(" Failed to connect database due to error -> " , error )
            process.exit(1)
            
        }
    

}
 export default ConnectDB






// async function ConnectDB(){
//    try {
//      const connectionInstance = await mongoose.connect(process.env.DB_URL);
//      console.log(chalk.bgBlue.bold(`Database connect on host ${connectionInstance.connection.host} and port ${connectionInstance.connection.port}`))
//    } catch (error) {
//      console.log("Failed to connect database due to error  ->  " , error)
//      process.exit(1)
//    }
    
// }


// export default ConnectDB;
