import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
  tareaId:    { type: Number, required: true },
  autor:      { type: String, required: true },
  comentario: { type: String, required: true },
  estrellas:  { type: Number, min: 1, max: 5 },
}, { timestamps: true });


export const Resena = mongoose.model('Resena', resenaSchema);