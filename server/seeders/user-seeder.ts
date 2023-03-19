import mongoose from 'mongoose'
import User from '../models/user.model.js'
import { createUser } from '../__tests__/mocks/users.mock.js'
import { defaultConfig } from '../config/default.server.js'

const connect = async () => {
  try {
    mongoose.connect(defaultConfig.db.connectString)
    console.log('DB CONNECTION OPEN')
  } catch (error) {
    console.log('Error connecting with Mongoose')
  }
}

const userData = () => {
  let users = []
  try {
    for (let i = 0; i <= 160; i++) {
      const user = createUser()
      users.push(user)
    }
    return users
  } catch (error) {
    console.log('Error creating Users')
  }
}

const seedDB = async () => {
  console.log('Deleting all users')
  await User.deleteMany({})
  console.log('Inserting all users...')
  const UserData = userData()
  await User.insertMany(UserData)
  console.log('Done with seeding DB!')
}

connect()

seedDB().then(() => {
  mongoose.connection.close()
})
