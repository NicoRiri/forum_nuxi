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
    const sujet_id = getRouterParam(event, 'sujet_id')
    const [sujet] = await conn.execute("SELECT * FROM Sujets WHERE id = ?", [sujet_id])

    if (sujet.length === 0){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Sujet inexistant"})
    }


    const body = await readBody(event)

    if (body === undefined){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Body vide"})
    }

    if (body.contenu === undefined){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Message null"})
    }

    const messWoSpace = body.contenu.replace(/\s/g, '')


    if (messWoSpace.length === 0){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Message vide"})
    }

    await conn.execute("INSERT INTO Messages (sujet_id, user_id, contenu) VALUES (?, ?, ?)", [sujet_id, user[0].id, body.contenu])

    setResponseStatus(event, 200)
    return ({status: 0, message: "Message ajouté avec succès"})
})
