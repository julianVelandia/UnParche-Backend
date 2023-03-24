import GroupModel from "../models/Group.model";
import { Request, Response } from "express";
import { IGroup } from "../interfaces/index"

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
  const {category, name, description, members, administrators} = req.body;
  //verificaciones, despues se haran con express validator
  try{
    if(!category || !name || !description || !members || !administrators) {
      return res.status(400).json({ ok: false, msg: "Por favor, proporcione todos los datos requeridos"});
    }
    const grupoExistente: IGroup | null = await GroupModel.findOne({ name });
      if (grupoExistente){
        return res.status(400).json({ok: false, msg: "Nombre dr grupo ya registrado"})
      }
      const categories = ['Arte', 'Deporte', 'Religion','Investigacion', 'Semillero', 'Videojuegos', 'Otro'];
      if (!categories.includes(category)){
        return res.status(400).json({ok: false, msg: "La categoria no existe"})
      }
    const nuevoGrupo = new GroupModel({category, name, description, members, administrators});
    await nuevoGrupo.save();
    return res.status(200).json({ok: true, "msg":"grupo registrado"});
    }catch(err){
      return res.status(400).json({ok: true, "msg":"Error en registro de grupo"});
    };
}

export const Update = async (req: Request, res: Response) => {

  const {category, name, description, members, administrators} = req.body;
  const groupId = req.params.id;
  try {
    const existingGroup = await GroupModel.findOne({
      $or: [{ name }],
      _id: { $ne: groupId },
    });
    //validaciones, mas adelante se haran con express validator
    const categories = ['Arte', 'Deporte', 'Religion','Investigacion', 'Semillero', 'Videojuegos', 'Otro'];
    if (!categories.includes(category)){
      return res.status(400).json({ok: false, msg: "La categoria no existe"})
    }
    if (existingGroup) {
      return res.status(400).json({ok:false,
        message: 'El nombre ya esta registrado',
      });  
    }
    const group = await GroupModel.findById(groupId);
    if(!group){
      return res.status(400).json({ok: false,
        message: 'el grupo no esta registrado'
      });  
    }
    group.category = category
    group.name = name;
    group.description = description;
    group.members = members;
    group.administrators = administrators;
    await group.save();
    return res.status(200).json({ok: true,
      message: 'Grupo actualizado'
    })
  }catch(err){
    console.log(err);
    res.status(400).json({ok: false, message:"Error actualizando grupo"});
  }
}
export const Delete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Obtén el ID del usuario a eliminar desde los parámetros de la solicitud

    // Verifica si existe un usuario con el ID proporcionado
    const usuarioExistente: IGroup | null = await GroupModel.findById(id);
    if (!usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario no existe' });
    }

    // Elimina el usuario de la base de datos
    await GroupModel.findByIdAndDelete(id);

    res.status(200).json({ok: true, mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Ocurrió un error en el servidor al eliminar el usuario' });
    
  }
}