import { Server } from 'socket.io'

export function createSocket(server, dbConnection) {
  const io = new Server(server)

  io.on('connection', async (socket) => {
    console.log('User connected!')

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })

    socket.on('chat message', async (message) => {
      try {
        const username = socket.handshake.auth.username ?? 'anonymous'
        const [result] = await dbConnection.query(`
          INSERT INTO messages (content, user) VALUES (?, ?)
        `, [message, username]
        )
        const { insertId } = result

        io.emit('chat message', message, insertId, username)
      } catch (err) {
        console.log(err)
      }
    })

    if (!socket.recovered) {
      try {
        const [results] = await dbConnection.execute(`
          SELECT id, content, user FROM messages WHERE id > ?
        `, [socket.handshake.auth.serverOffset ?? 0]
        )

        results.forEach(row => {
          socket.emit('chat message', row.content, row.id.toString(), row.user)
        })
      } catch (err) {
        console.log(err)
      }
    }
  })
}
