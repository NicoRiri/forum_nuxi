import {connection} from "~/server/utils";
// @ts-ignore
import {hash, genSalt} from "bcrypt";

export default defineEventHandler(async (event) => {
     const auth = event.headers.get("Authorization")
     if (auth === undefined || auth === null) {
          setResponseStatus(event, 401)
          return ({status: 1, error: "Authentification requise"})
     }

     if (!auth.startsWith("Basic ")) {
          setResponseStatus(event, 401)
          return ({status: 1, error: "Authentification mal formée"})
     }

     let text = ""
     try {
          const b64 = auth.split(" ")[1]
          text = atob(b64)
     } catch (e) {
          setResponseStatus(event, 401)
          return ({status: 1, error: "Encodage mal fait"})
     }
     const login = text.split(":")[0]
     if (login === "") {
          setResponseStatus(event, 401)
          return ({status: 1, error: "Login requis"})
     }
     const password = text.split(":")[1]
     if (password === "") {
          setResponseStatus(event, 401)
          return ({status: 1, error: "Mot de passe requis"})
     }

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
