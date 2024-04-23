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

    if (body.message_id === undefined){
        setResponseStatus(event, 401)
        return ({status: 1, error: "message null"})
    }

    const mIdWoSpace = body.message_id.replace(/\s/g, '')


    if (mIdWoSpace.length === 0){
        setResponseStatus(event, 401)
        return ({status: 1, error: "message Vide"})
    }

    if (admin_boolean){
        await conn.execute("DELETE FROM Messages WHERE id = ?", [body.message_id])
        setResponseStatus(event, 200)
        return ({status: 0, error: "Le message a bien été supprimé"})
    } else {
        setResponseStatus(event, 401)
        return ({status: 1, error: "Pas la permission de supprimer un message"})
    }
})
