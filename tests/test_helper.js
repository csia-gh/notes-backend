const bcrypt = require('bcrypt')
const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map((note) => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const getAuthToken = async (api, username, password) => {
  // Ensure the test user exists
  let user = await User.findOne({ username })
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10)
    user = new User({ username, passwordHash })
    await user.save()
  }

  // Use the real login endpoint
  const response = await api
    .post('/api/login')
    .send({ username, password })

  if (response.status !== 200) {
    throw new Error(`Failed to login: ${response.status} ${response.text}`)
  }

  return { token: response.body.token, user }
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  getAuthToken,
}
