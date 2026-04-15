import chalk from "chalk";
import ConnectDB from "./config/db.config.js";
import app from "./app.js";

const PORT = process.env.PORT || 7000;``
ConnectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(chalk.green.bgBlack.bold.underline("server is running on port ",PORT));
        
    })
}).catch((err)=>{
    console.log(chalk.red("faild to run database and server "));
    
})
