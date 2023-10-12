import express, { Request, Response } from "express";

import dotenv from "dotenv"
import moviesRouter from "./routes/moviesRouter";
import cors from "cors";


dotenv.config();

const app = express();
app.use(express.json());




app.use(cors());

app.use("/api/movies", moviesRouter);

app.get("/", (req: Request, res: Response) => {

    res.send("Hello World");

});

app.listen(5000, () => console.log(""));
