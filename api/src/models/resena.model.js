import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
  tareaId:    { type: Number, required: [true, "El tareaId es obligatorio"] },
  autor:      { type: String, required: [true, "El autor es obligatorio"] },
  comentario: { type: String, required: [true, "El comentario es obligatorio"] },
  estrellas:  { type: Number, min: [1, "Mínimo 1 estrella"], max: [5, "Máximo 5 estrellas"] },
}, { timestamps: true });

export const Resena = mongoose.model('Resena', resenaSchema);