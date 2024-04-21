import {connection} from "~/server/utils";
import {compare} from "bcrypt";

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
        return({status: 1, error: "Encodage mal fait"})
    }
    const email = text.split(":")[0]
    if (email === "") {
        setResponseStatus(event, 401)
        return({status: 1, error: "Email requis"})
    }
    const password = text.split(":")[1]
    if (password === "") {
        setResponseStatus(event, 401)
        return ({status: 1, error: "Mot de passe requis"})
    }

    const conn = await connection

    //Vérifier qu'il est admin
    const admin = await conn.execute("SELECT * FROM Users WHERE email = ?", [email])

    const resCompareAdmin = await compare(password, admin[0].password)

    if (resCompareAdmin === false) {
        setResponseStatus(event, 401)
        return ({status: 1, error: "Mot de passe incorrect"})
    } else {
        const body = await readBody(event)
        const [insert] = await conn.execute("INSERT INTO Forums (name) VALUES (?)", [body.nom])

        setResponseStatus(event, 200)
        return {
            "message" : insert
        }
    }
})
