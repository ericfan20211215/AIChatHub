import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

//connections and listeners
connectToDatabase()
  .then(()=>{
    app.listen(5500, () => console.log("Server Open"))
  })
  .catch((err)=>console.log(err));
