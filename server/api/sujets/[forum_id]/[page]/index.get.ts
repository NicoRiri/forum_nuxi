import {connection} from "~/server/utils";

export default defineEventHandler(async (event) => {
    const conn = await connection
    const page = getRouterParam(event, 'page')
    const forum_id = getRouterParam(event, 'forum_id')
    const offset = (parseInt(page!)-1) * 20
    const [rows] = await conn.execute("SELECT * FROM Sujets WHERE forum_id = ? LIMIT 20 OFFSET ?", [forum_id, offset])

    setResponseStatus(event, 200)
    return rows
})
