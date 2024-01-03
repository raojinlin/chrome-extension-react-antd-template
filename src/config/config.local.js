export default {
    logger: {
        handler: 'http',
        options: {
            url: 'https://api.mywebsite.com/api/v1/clientlogs', 
            method: 'POST',
            formatter: 'json',
        },
    }
}