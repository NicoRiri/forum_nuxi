import {connection} from "~/server/utils";
import {compare} from "bcrypt";
import useRoute from "nuxt/app";

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

    if (resCompareUser === false) {
        setResponseStatus(event, 401)
        return ({status: 1, error: "Login ou mot de passe incorrect"})
    }

    //Vérifier si sujet existe
    const forum_id = getRouterParam(event, 'forum_id')
    const [forum] = await conn.execute("SELECT * FROM Forums WHERE id = ?", [forum_id])

    if (forum.length === 0){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Forum inexistant"})
    }


    const body = await readBody(event)

    if (body === undefined){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Body vide"})
    }

    if (body.nom === undefined){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Nom null"})
    }

    if (body.message_initial === undefined){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Message Initial null"})
    }

    const nomWoSpace = body.nom.replace(/\s/g, '')
    const messWoSpace = body.message_initial.replace(/\s/g, '')

    if (nomWoSpace.length === 0){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Nom vide"})
    }

    if (messWoSpace.length === 0){
        setResponseStatus(event, 401)
        return ({status: 1, error: "Message initial vide"})
    }

    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await conn.execute("INSERT INTO Sujets (nom, forum_id, auteur, message_initial, date) VALUES (?, ?, ?, ?, ?)", [body.nom, forum_id, user[0].id, body.message_initial, date])

    setResponseStatus(event, 200)
    return ({status: 0, message: "Message ajouté avec succès"})
})
