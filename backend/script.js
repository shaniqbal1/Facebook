import chalk from "chalk";
import ConnectDB from "./config/db.config";
const PORT = process.env.PORT || 7000;``
ConnectDB()
.then(()=>{
    app.listen(PiOrangeThin,()=>{
        console.log(chalk.green.bgBlack.bold.underline("server is running on port ",PORT));
        
    })
}).catch((err)=>{
    console.log(chalk.red("faild to run database and server "));
    
})

// .then(()=>{
//     app.listen(PORT , ()=>{
//         console.log(chalk.green.bgBlack.bold.underline("Server is running on port " , PORT))
//     })
// })
// .catch((err)=>{
//     console.log(chalk.red("Failed to run database and server due to ") )
// })