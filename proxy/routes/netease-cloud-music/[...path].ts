export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    console.log(
        'Fetching NetEaseClouldMusic API',
        {
            url: getRequestURL(event).href,
            query,
            params: event.context.params,
        },
    )
    const config = useRuntimeConfig();
    try {
        return await $fetch(event.context.params!.path, {
            baseURL: config.neteaseCloudMusic.apiBaseUrl,
            params: {
                ...query,
            },
            headers: {
                Accept: 'application/json',
            },
        })
    }
    catch (e: any) {
        const status = e?.response?.status || 500
        setResponseStatus(event, status)
        return {
            error: String(e),
        }
    }
})