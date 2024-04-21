import {connection} from "~/server/utils";

export default defineEventHandler(async (event) => {
    const conn = await connection

    const page = getRouterParam(event, 'page')
    const sujet_id = getRouterParam(event, 'sujet_id')
    const offset = (parseInt(page!)-1) * 20
    const [rows] = await conn.execute("SELECT Messages.id, sujet_id, timestamp, contenu, Users.nom AS auteur, Messages.user_id AS auteur_id FROM Messages INNER JOIN Users ON Messages.user_id = Users.id WHERE sujet_id = ? LIMIT 20 OFFSET ?", [sujet_id, offset])

    setResponseStatus(event, 200)
    return rows
})
