import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";


const port = process.env.PORT || 5001;


connectDB()
    .then(()=>{
        app.listen(port, ()=>{
            console.log(`The server is running on port http://localhost:${port}`);
        })
    })
    .catch((err)=>{
        console.error("MongoDB connection failed: ", err.message);
        process.exit(1);
    });

// app.listen(port, ()=>{
//     console.log(`The server is running on port http://localhost:${port}`);
// });

