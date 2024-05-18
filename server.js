import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
dotenv.config()
const app = express();
import router from "./router/route.js";
import ChatRoute from './Chat/ChatRoute.js';
import MessageRoute from './Chat/MessageRoute.js';
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello World');
})
app.use("/api", router);
app.use('/chat', ChatRoute); 
app.use('/message', MessageRoute); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
});
