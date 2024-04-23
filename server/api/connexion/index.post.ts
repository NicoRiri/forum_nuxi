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
