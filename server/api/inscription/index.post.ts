import {connection} from "~/server/utils";
// @ts-ignore
import {hash, genSalt} from "bcrypt";

export default defineEventHandler(async (event) => {
     const conn = await connection
     const headers = event.headers
     const auth = headers.get("Authorization")
     const b64 = auth!.split(" ")[1]
     const text = atob(b64)
     const login = text.split(":")[0]
     const password = text.split(":")[1]

     const passwdhash = await hash(password, await genSalt(10))

     const [verifRows] = await conn.execute("SELECT COUNT(*) as nb FROM Users WHERE nom = ?", [login])

     // @ts-ignore
     if (verifRows[0].nb > 0){
          return {
               message: `Ce nom d'utilisateur existe déjà`
          }
     }


     const [rows, fields] = await conn.execute(`INSERT INTO Users (nom, password, admin) VALUES (?, ?, ?)`, [login, passwdhash, 0])
     if ("serverStatus" in rows && rows.serverStatus === 2){
          return {
               message: `le compte a bien été créé`
          }
     } else {
          return {
               message: `le compte n'a pas été créé`
          }
     }

})
