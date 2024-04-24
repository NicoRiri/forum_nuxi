import {connection} from "~/server/utils";
import {compare, genSalt, hash} from "bcrypt";

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

     //Vérifier qu'il existe / mot de passe est bon
     const [user] = await conn.execute("SELECT * FROM Users WHERE nom = ?", [login])

     const admin_v = user[0].admin
     const admin_buffer = Buffer.from(admin_v)
     const admin_boolean = Boolean(admin_buffer.readInt8())

     //Le compte n'existe pas
     if (user.length === 0) {
          setResponseStatus(event, 401)
          return ({status: 1, error: "Login ou mot de passe incorrect"})
     }


     const resCompareUser = await compare(password, user[0].password)

     if (!resCompareUser) {
          setResponseStatus(event, 401)
          return ({status: 1, error: "Login ou mot de passe incorrect"})
     }

     const body = await readBody(event)

     if (body === undefined){
          setResponseStatus(event, 401)
          return ({status: 1, error: "Body vide"})
     }

     if (body.nom === undefined){
          setResponseStatus(event, 401)
          return ({status: 1, error: "nom null"})
     }

     if (body.password === undefined){
          setResponseStatus(event, 401)
          return ({status: 1, error: "password null"})
     }

     const nomWoSpace = body.nom.replace(/\s/g, '')
     const passwordWoSpace = body.password.replace(/\s/g, '')

     if (nomWoSpace.length === 0){
          setResponseStatus(event, 401)
          return ({status: 1, error: "nom Vide"})
     }

     if (passwordWoSpace.length === 0){
          setResponseStatus(event, 401)
          return ({status: 1, error: "password Vide"})
     }

     const [existRow] = await conn.execute("SELECT * FROM Users WHERE nom = ?", [body.nom])
     if (existRow.length > 0){
          setResponseStatus(event, 401)
          return ({status: 1, error: "Le nom du compte existe déjà"})
     }

     if (admin_boolean){
          const passwdhash = await hash(body.password, await genSalt(10))

          await conn.execute("INSERT INTO Users (nom, password, admin) VALUES (?, ?, ?)", [body.nom, passwdhash, 1])
          setResponseStatus(event, 200)
          return ({status: 0, error: "Le compte admin a bien été créé"})
     } else {
          setResponseStatus(event, 401)
          return ({status: 1, error: "Pas la permission de supprimer un message"})
     }
})
