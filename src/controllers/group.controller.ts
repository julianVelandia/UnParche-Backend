/* Falta el modelo de grupo */ 

import UserModel from "../models/User.model";
import { Request, Response } from "express";
import { IUser } from "../interfaces/index";

export const getGroupsfromUser = async (req: Request, res: Response) => {
  try {
    // retornar todos los usuarios registrados
    const users = await UserModel.find({username:"Lan27"});
    console.log(users);
    return res.status(200).json({ ok: true, data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: "Contact an admin" });
  }
};