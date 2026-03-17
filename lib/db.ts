import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import path from "path"

/* ================= TYPES ================= */

export type User = {
  id: string
  name: string
  email: string
  password: string // hashed
  createdAt: string
}

type Data = {
  users: User[]
}

/* ================= DB SETUP ================= */

const file = path.join(process.cwd(), "data/db.json")
const adapter = new JSONFile<Data>(file)

export const db = new Low<Data>(adapter, {
  users: [],
})

/* ================= INIT ================= */

export async function initDB() {
  await db.read()
  db.data ||= { users: [] }
}