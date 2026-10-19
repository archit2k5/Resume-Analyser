import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
});
import app from "./app.js"

const port = process.env.PORT || 5001;

app.listen(port, ()=>{
    console.log(`The server is running on port http://localhost:${port}`);
});


