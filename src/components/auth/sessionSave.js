import { Session } from "./model.js"
import {v4 as uuidv4 } from "uuid"

export const sessionSave = async (ip, userId) => {
  const uid = uuidv4()  
  if(userId) {       
      try {
          await Session.create({
              idSession: uid,
              userId: userId,
              session_date: Date.now(),
              ip: ip
          })
      } catch (error) {
          console.log(error)
      }  
  }
}