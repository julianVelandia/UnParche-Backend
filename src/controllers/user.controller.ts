import UserModel from "../models/User.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { IUser } from "../interfaces/index"
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // retornar todos los usuarios registrados
    const users = await UserModel.find({});
    return res.status(200).json({ ok: true, data: users });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, msg: "Contact an admin" });
  }

};
export const Register = async(req:Request, res: Response)=>{
  //registro de usuario 
  try {

    // las validaciones se haran luego con express validator
    const {email, password, username, password_confirmation} = req.body;

    if (!password_confirmation  || !email || !password|| !username) {
      return res.status(400).json({ mensaje: 'Por favor, proporcione todos los datos requeridos' });
    }
    // Verificar si ya existe un usuario con el correo electrónico proporcionado
    const usuarioExistente: IUser | null = await UserModel.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese correo electrónico' });
    }
    // Verificar si el correo es institucional
    if(!email.includes("@unal.edu.co")){
      return res.status(400).json({ mensaje: 'Debe registrarse con su correo institucional' });
    }
    // Verificar seguridadd e la contraseña
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regexPass.test(password)) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número' });
    }
    //verificar que las contraseñas coincidan
    if(password != password_confirmation){
      return res.status(400).json({mensaje: "Las contraseñas no coinciden"})
    }
    //verificar si ya existe usuario con el mismo username
    const usernameExistente: IUser | null = await UserModel.findOne({ username });
    if (usernameExistente) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese nombre de usuario' });
    }

    // Encriptar contraseña
    const salt: string = await bcrypt.genSalt(10);
    const passwordCrypt: string = await bcrypt.hash(password, salt);

    // Crear una nueva instancia del modelo de usuario y guardarla en la base de datos
    const nuevoUsuario = new UserModel({email, username,password: passwordCrypt});
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Ocurrió un error en el servidor al registrar el usuario' });
  }
};

export const Update = async (req: Request, res: Response) => {
  const { username, email, password, password_confirmation } = req.body;
  const userId = req.params.id;

  try {
    // Verificar si el correo electrónico o el nombre de usuario ya existen en la base de datos
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: userId },
    });
    if (existingUser) {
      return res.status(400).json({
        message: 'El correo electrónico o el nombre de usuario ya están registrados',
      });
    }

    // Actualizar usuario
    const user = await UserModel.findById(userId);
    if(!user){
      return res.status(400).json({ok: false, "msg": "Usuario no encontrado"});
    }
    if(password != password_confirmation){
      return res.status(400).json({ok: false, "msg": "las contraseñas no coinciden"});
    }
    const salt: string = await bcrypt.genSalt(10);
    const passwordCrypt: string = await bcrypt.hash(password, salt)
    user.username = username;
    user.email = email;
    user.password = passwordCrypt;
    await user.save();

    res.status(200).json({
      message: 'Usuario actualizado con éxito',
      user,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};


export const Delete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Obtén el ID del usuario a eliminar desde los parámetros de la solicitud

    // Verifica si existe un usuario con el ID proporcionado
    const usuarioExistente: IUser | null = await UserModel.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: 'El usuario no existe' });
    }

    // Elimina el usuario de la base de datos
    await UserModel.findByIdAndDelete(id);

    res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Ocurrió un error en el servidor al eliminar el usuario' });
    
  }
};