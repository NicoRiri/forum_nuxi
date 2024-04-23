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
    const [admin] = await conn.execute("SELECT * FROM Users WHERE nom = ?", [login])

    //Le compte n'existe pas
    if (admin.length === 0) {
        setResponseStatus(event, 401)
        return ({status: 1, error: "Login ou mot de passe incorrect"})
    }


    const resCompareAdmin = await compare(password, admin[0].password)

    if (resCompareAdmin === false) {
        setResponseStatus(event, 401)
        return ({status: 1, error: "Login ou mot de passe incorrect"})
    }

    //Vérifier qu'il est admin
    const admin_v = admin[0].admin
    const admin_buffer = Buffer.from(admin_v)
    const admin_boolean = Boolean(admin_buffer.readInt8())

    const body = await readBody(event)

    if (admin_boolean) {
        if (body === undefined) {
            setResponseStatus(event, 401)
            return ({status: 1, error: "Body vide"})
        }

        if (body.nom === undefined){
            setResponseStatus(event, 401)
            return ({status: 1, error: "Nom null"})
        }

        const nomWoSpace = body.nom.replace(/\s/g, '')

        if (nomWoSpace.length === 0) {
            setResponseStatus(event, 401)
            return ({status: 1, error: "Nom vide"})
        }

        await conn.execute("INSERT INTO Forums (name) VALUES (?)", [body.nom])

        setResponseStatus(event, 200)
        return ({status: 0, message: "Forum ajouté avec succès"})
    } else {
        setResponseStatus(event, 401)
        return ({status: 1, error: "Compte pas administrateur"})
    }
})
