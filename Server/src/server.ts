import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const port = process.env.PORT || 8000;
const app:Express= express();

app.get("/", (req:Request, res:Response) => {
    res.send("EU SOU FELIZ!");
});

app.listen(port, () => {
    console.log(`Listening on port ${process.env.PORT}`)
});