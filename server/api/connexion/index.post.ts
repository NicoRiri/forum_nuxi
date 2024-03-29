     import {connection} from "~/server/utils";
// @ts-ignore
     import {hash, genSalt, compare} from "bcrypt";

     export default defineEventHandler(async (event) => {
          const conn = await connection
          const headers = event.headers
          const auth = headers.get("Authorization")
          const b64 = auth!.split(" ")[1]
          const text = atob(b64)
          const login = text.split(":")[0]
          const password = text.split(":")[1]

          const [passwordBdd] = await conn.execute("SELECT password FROM Users WHERE nom = ?", [login])
          // @ts-ignore
          const res = await compare(password, passwordBdd[0].password)
          if(res){
               setResponseStatus(event, 202)
               return {
                    "message" : "connecté"
               }
          } else {
               setResponseStatus(event, 401)
               return {
                    "message" : "Mot de passe ou login incorrecte"
               }
          }
     })
