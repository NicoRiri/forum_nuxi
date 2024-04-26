     import {connection} from "~/server/utils";
// @ts-ignore
     import {hash, genSalt, compare} from "bcrypt";

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

          const conn = await connection

          const [passwordBdd] = await conn.execute("SELECT id, password, admin FROM Users WHERE nom = ?", [login])

          if (passwordBdd.length === 0){
               setResponseStatus(event, 401)
               return ({status: 1, error: "Mot de passe ou login incorrecte"})
          }

          // @ts-ignore
          const res = await compare(password, passwordBdd[0].password)
          if(res){
               const admin_v = passwordBdd[0].admin
               const admin_buffer = Buffer.from(admin_v)
               const admin_boolean = Boolean(admin_buffer.readInt8())
               setResponseStatus(event, 202)
               return {
                    "message" : "connecté",
                    "admin" : admin_boolean,
                    "id" : passwordBdd[0].id
               }
          } else {
               setResponseStatus(event, 401)
               return {
                    "status": 0,
                    "message" : "Mot de passe ou login incorrecte"
               }
          }
     })
