import {connection} from "~/server/utils";
import {compare, genSalt, hash} from "bcrypt";
import {id} from "vuetify/locale";

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

    //Vérifier si sujet existe
    const body = await readBody(event)

    if (body === undefined){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Body vide"})
    }

    if (body.password === undefined){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Message null"})
    }

    const passWoSpace = body.password.replace(/\s/g, '')

    if (passWoSpace.length === 0){
        setResponseStatus(event, 401)
        return ({status: 1, error: "mot de passe vide"})
    }

    const passwdhash = await hash(body.password, await genSalt(10))

    await conn.execute("UPDATE Users SET password = ? WHERE id = ?", [passwdhash, user[0].id])

    setResponseStatus(event, 200)
    return ({status: 0, message: "Mot de passe modifié avec succès"})
})
