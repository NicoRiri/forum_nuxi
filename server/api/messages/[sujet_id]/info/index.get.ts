import {connection} from "~/server/utils";

export default defineEventHandler(async (event) => {
    const conn = await connection
    const sujet_id = getRouterParam(event, 'sujet_id')
    const [rowsCount] = await conn.execute("SELECT COUNT(*) as nb FROM Messages WHERE sujet_id = ?", [sujet_id])

    // @ts-ignore
    const nbPage = Math.ceil(parseInt(rowsCount[0].nb)/20)


    setResponseStatus(event, 200)
    return {
        "nbPage" : nbPage,
        // @ts-ignore
        "nb":rowsCount[0].nb
    }
})
