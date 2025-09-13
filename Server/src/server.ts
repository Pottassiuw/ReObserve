import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv'
import { criarEmpresa } from "./controllers/createEnterprise";
import app from "./app"
dotenv.config({ path: '.env' })

const port = process.env.PORT || 8000;

app.listen(port, () =>{
    console.log(`Escutando a porta ${port}`)
})