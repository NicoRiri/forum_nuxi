import {connection} from "~/server/utils";

export default defineEventHandler(async (event) => {
    const conn = await connection

    const page = getRouterParam(event, 'page')
    const sujet_id = getRouterParam(event, 'sujet_id')
    const offset = (parseInt(page!)-1) * 20
    const [rows] = await conn.execute("SELECT * FROM Messages WHERE sujet_id = ? LIMIT 20 OFFSET ?", [sujet_id, offset])

    setResponseStatus(event, 200)
    return rows
})
