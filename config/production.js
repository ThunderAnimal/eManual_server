module.exports = {
    server:{
        adresse: process.env.ADRESSE ,
        port: process.env.PORT,
        secret: process.env.SECRET
    },
    database:{
        //mongodb://username:password@host:port/database
        connectionURL: process.env.DATABASE_URL
    },
    oauth:{
        google:{
            client_id : process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET
        },
        facebook:{
            client_id : process.env.FACEBOOK_CLIENT_ID,
            client_secret: process.env.FACEBOOK_CLIENT_SECRET
        }
    }
};