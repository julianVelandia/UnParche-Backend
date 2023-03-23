import UserModel from "../models/User.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/index";
import { sendEmail } from "../services/email";

export const TimeoutPromise = (pr: Promise<any>, timeout: number) =>
  Promise.race([pr, new Promise((_, rej) => setTimeout(rej, timeout))]);

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // retornar todos los usuarios registrados
    const users = await UserModel.find({});
    return res.status(200).json({ ok: true, data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: "Contact an admin" });
  }
};

export const Register = async (req: Request, res: Response) => {
  //registro de usuario
  try {
    // Validar existencia de la información del usuario
    const { name, email, password, username, password_confirmation } = req.body;
    if (!name || !email || !password || !username) {
      return res.status(400).json({
        ok: false,
        msg: "Por favor, proporcione todos los datos requeridos",
      });
    }
    // Verificar si ya existe un usuario con el correo electrónico proporcionado
    const usuarioExistente: IUser | null = await UserModel.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con ese correo electrónico",
      });
    }
    // Verificar si el correo es institucional
    if (!email.includes("@unal.edu.co")) {
      return res.status(400).json({
        ok: false,
        msg: "Debe registrarse con su correo institucional",
      });
    }
    // Verificar seguridadd e la contraseña
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regexPass.test(password)) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número",
      });
    }
    //verificar que las contraseñas coincidan
    if (password != password_confirmation) {
      return res.status(400).json({ mensaje: "Las contraseñas no coinciden" });
    }
    //verificar si ya existe usuario con el mismo username
    const usernameExistente: IUser | null = await UserModel.findOne({
      username,
    });
    if (usernameExistente) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con ese nombre de usuario",
      });
    }
    // Encriptar contraseña
    const salt: string = await bcrypt.genSalt(10);
    const passwordCrypt: string = await bcrypt.hash(password, salt);

    // Crear una nueva instancia del modelo de usuario y guardarla en la base de datos
    const nuevoUsuario = new UserModel({
      name,
      email,
      username,
      password: passwordCrypt,
      verified: false,
    });
    await nuevoUsuario.save();

    // Configuración de los elementos del correro de verificación
    const subject = "[UNParche] Verifica tu correo electrónico ";
    const message = "Para verificar tu correo electrónico ve al siguiente enlace xxxxxxxxxxx";
    // Funció para el envío del correo
    const info = sendEmail(email,message,subject);
    console.log(info);

    return res.status(201).json({ mensaje: "Usuario registrado exitosamente" });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Ocurrió un error en el servidor al registrar el usuario",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    // El usuario ingrese a la cuenta
    console.log("hola login");
    const { email, password } = req.body;
    //key puede referirse al username o al email
    const currentUserk: IUser | null = await UserModel.findOne({ email });

    /** Se debe especificar si de ha dado el correo o el nombre de usuario,
     * por ahora se implementa sólo con email,
     * luego miramos cómo hacerlo para usuario
     */

    if (!email || !password) {
      //Se verifica que estén los datos pedidos
      return res.status(400).json({
        ok: false,
        msg: "Por favor, proporcione todos los datos requeridos",
      });
    }

    if (!currentUserk) {
      //Se verifica que el nombre de usuario o correo correspondan a algun usuario registrado
      return res
        .status(404)
        .json({ ok: false, msg: "El correo dado no se encuentra registrado" });
    }

    //se verifica que la contraseña sea correcta
    bcrypt.compare(password, currentUserk.password, function (err, matches) {
      if (err) {
        console.log("Error while checking password");
        return res
          .status(500)
          .json({ ok: false, msg: "Error al verificar la contraseña" });
      } else if (matches) {
        console.log("The password matches!");

        if (!currentUserk.verified) {
          //Se revisa que el usuario haya verificado su cuenta al momento de registrarse
          return res.status(401).json({
            ok: false,
            msg: "Debes verificar tu cuenta para poder ingresar",
          });
        } else {
          return res.status(401).json({
            ok: true,
            msg: "El usuario ha ingresado con éxito a su cuenta",
          });
        }
      } else {
        console.log("The password does NOT match!");
        return res.status(400).json({
          ok: false,
          msg: "La contraseña es incorrecta, vuelva a intentarlo",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Ocurrió un error en el servidor al ingresar a la cuenta",
    });
  }
};

export const updateUser =async (req:Request, res: Response) => {
  try {
    const { name, email, password, username, password_confirmation } = req.body;
    // Verificar seguridadd e la contraseña
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regexPass.test(password)) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número",
      });
    }
    //verificar que las contraseñas coincidan
    if (password != password_confirmation) {
      return res.status(400).json({ mensaje: "Las contraseñas no coinciden" });
    }
    
    const salt: string = await bcrypt.genSalt(10);
    const passwordCrypt: string = await bcrypt.hash(password, salt);

    const datos = {name:name, username:username, password:passwordCrypt}
    UserModel.findOneAndUpdate({email: email}, datos, {new: true} )
    .then(resultado => {
      return res.status(200).json({ mensaje: "Información de usuario actualizada." });
    })
    .catch(error =>{
      if(error.code == 11000){
        return res.status(400).json({ok: false, msg: "Ya existe un usuario con ese username"});
      } else return res.status(400).json({ok: false, msg: "Error al actualizar datos de usuario."});
    });

  } catch (error) {
    return res.status(400).json({ok: false, msg: "Error al actualizar datos de usuario."});
  }
}
