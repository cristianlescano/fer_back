import { Schema, model } from "mongoose";

const schemasession = new Schema({
  idSession: String,
  userId: String,
  session_date: Date,
  ip: String

})

export const Session = model('sessions', schemasession)