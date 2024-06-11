import mysql from 'mysql2/promise'

export async function connectDatabase() {
  const config = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'lifechatdb'
  }

  const connection = await mysql.createConnection(config)

  await connection.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER AUTO_INCREMENT PRIMARY KEY, 
      content TEXT,
      user VARCHAR(50)
    )
    `, []
  )

  return connection
}
