import mongoose from 'mongoose'
import { defaultConfig } from '../config/default.server.js'

export async function connect() {
 const databaseURI = defaultConfig.db.connectString
 try {
   await mongoose.connect(databaseURI)
   console.log('Connection to Database Succsessful!')
 } catch(error){
    console.log('Connection to Database Failed ' + error)
    process.exit(1)
 }
}



