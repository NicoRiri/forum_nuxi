import {connection} from "~/server/utils";

export default defineEventHandler(async (event) => {
    const conn = await connection
    const page = getRouterParam(event, 'page')
    const forum_id = getRouterParam(event, 'forum_id')
    const offset = (parseInt(page!)-1) * 20
    const [rows] = await conn.execute("SELECT Sujets.id, Sujets.nom, Sujets.forum_id, Sujets.message_initial, Sujets.date, Users.nom AS auteur, Messages.timestamp AS dernier_message_timestamp FROM Sujets INNER JOIN Users ON Sujets.auteur = Users.id INNER JOIN ( SELECT sujet_id, MAX(timestamp) AS dernier_message_timestamp FROM Messages GROUP BY sujet_id ) AS DerniersMessages ON Sujets.id = DerniersMessages.sujet_id INNER JOIN Messages ON DerniersMessages.sujet_id = Messages.sujet_id AND DerniersMessages.dernier_message_timestamp = Messages.timestamp INNER JOIN Users AS LastMessageUser ON Messages.user_id = LastMessageUser.id WHERE Sujets.forum_id = ? ORDER BY dernier_message_timestamp DESC LIMIT 20 OFFSET ?", [forum_id, offset])
    setResponseStatus(event, 200)
    return rows
})
