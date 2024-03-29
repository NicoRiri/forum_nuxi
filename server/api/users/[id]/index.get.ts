import {connection} from "~/server/utils";

export default defineEventHandler(async (event) => {
    const conn = await connection

    const id = getRouterParam(event, 'id')
    const [rows] = await conn.execute("SELECT id, nom FROM Users WHERE id = ?", [id])

    setResponseStatus(event, 200)
    return rows
})
