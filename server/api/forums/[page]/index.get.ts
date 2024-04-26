import {connection} from "~/server/utils";

export default defineEventHandler(async (event) => {
    const conn = await connection

    const page = getRouterParam(event, 'page')
    const offset = (parseInt(page!)-1) * 20
    const [rows] = await conn.execute("SELECT f.id, f.name, COUNT(s.id) AS sujetNb FROM Forums f LEFT JOIN Sujets s ON f.id = s.forum_id GROUP BY f.id, f.name LIMIT 20 OFFSET ?", [offset])

    setResponseStatus(event, 200)
    return rows
})
