import GroupModel from "../models/Group.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { IUser } from "../interfaces/index"

export const getAllGroups = async (req: Request, res: Response) => {
    try {
      // retornar todos los gruposs registrados
      const groups = await GroupModel.find({});
      return res.status(200).json({ ok: true, data: groups});
    } catch (error) {

      console.log(error);
      return res.status(500).json({ ok: false, msg: "Error obteniendo grupos" });
    }
};

export const Register = async (req: Request, res: Response) => {

}

export const Update = async (req: Request, res: Response) => {

}

export const Delete = async (req: Request, res: Response) => {
    
}