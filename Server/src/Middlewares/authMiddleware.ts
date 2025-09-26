import jwt from "jsonwebtoken"
import  {Request, Response, NextFunction} from "express"
import {AuthService} from "../Helpers/authservice"

const authSession = (req: Request, res:Response, next: NextFunction ) => {
    try {
    	const token = req.cookies;


      
	    console.log(token)

  } catch (error: any) {
    console.error("Tipo do erro:", error.constructor.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      error: "Erro interno do servidor",
      success: false,
      errorType: error.constructor.name,
    });
  }

}
