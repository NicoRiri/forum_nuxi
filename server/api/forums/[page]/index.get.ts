import {connection} from "~/server/utils";

export default defineEventHandler(async (event) => {
    const conn = await connection

    const page = getRouterParam(event, 'page')
    const offset = (parseInt(page!)-1) * 20
    console.log(offset)
    const [rows] = await conn.execute("SELECT * FROM Forums LIMIT 20 OFFSET ?", [offset])

    setResponseStatus(event, 200)
    return rows
})
