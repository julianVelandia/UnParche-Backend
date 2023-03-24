import { model, Schema } from "mongoose";
import { IGroup } from "../interfaces";

const groupSchema = new Schema(
    {
      category: {
        type: String,
        enum: ['Arte', 'Deporte', 'Religion','Investigacion', 'Semillero', 'Videojuegos', 'Otro']
    },
      name: { type: String, required: true, unique: true },
      description: { type: String, required: true },
      members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      administrators: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    {
      timestamps: true,
    }
  );

export default model<IGroup>("Group", groupSchema);