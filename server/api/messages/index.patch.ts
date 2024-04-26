import {connection} from "~/server/utils";
import {compare} from "bcrypt";
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

    const admin_v = user[0].admin
    const admin_buffer = Buffer.from(admin_v)
    const admin_boolean = Boolean(admin_buffer.readInt8())


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

    if (body.contenu === undefined){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Message null"})
    }

    if (body.message_id === undefined){
        setResponseStatus(event, 401)
        return ({status: 1, error: "id null"})
    }

    const messWoSpace = body.contenu.replace(/\s/g, '')
    const idWoSpace = body.message_id.replace(/\s/g, '')


    if (messWoSpace.length === 0){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Message vide"})
    }

    if (idWoSpace.length === 0){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Id vide"})
    }

    const [auteurMess] = await conn.execute("SELECT * FROM Messages WHERE id = ?", [body.message_id])

    let ownBoo = false

    if (auteurMess[0].user_id === user[0].id) ownBoo = true

    if (!ownBoo && !admin_boolean){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Pas la permission de modifier le message d'un autre"})
    }

    await conn.execute("UPDATE Messages SET contenu = ? WHERE id = ?", [body.contenu, body.message_id])

    setResponseStatus(event, 200)
    return ({status: 0, message: "Message modifié avec succès"})
})
