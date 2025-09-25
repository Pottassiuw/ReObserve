import jwt from "jsonwebtoken"
import  {Request, Response, NextFunction} from "express"
import {AuthService} from "../Helpers/authservice"

const authSession = (req: Request, res:Response, next: NextFunction ) => {
    try {
    	const token = req.cookies;
	console.log(token)
  } catch (error) {
	console.error("Erro no Servidor: ",error);	
    }

}
