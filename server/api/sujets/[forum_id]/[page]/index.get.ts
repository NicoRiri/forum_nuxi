import {connection} from "~/server/utils";

export default defineEventHandler(async (event) => {
    const conn = await connection
    const page = getRouterParam(event, 'page')
    const forum_id = getRouterParam(event, 'forum_id')
    const offset = (parseInt(page!)-1) * 20
    const [rows] = await conn.execute("SELECT Sujets.id, forum_id, message_initial, date, Users.nom AS auteur, (SELECT Users.nom FROM Messages INNER JOIN Users ON Messages.user_id = Users.id WHERE Messages.sujet_id = Sujets.id ORDER BY Messages.timestamp DESC LIMIT 1) AS message_der_auteur FROM Sujets INNER JOIN Users ON Sujets.auteur = Users.id WHERE forum_id = ? LIMIT 20 OFFSET ?", [forum_id, offset])
    setResponseStatus(event, 200)
    return rows
})
