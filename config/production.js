module.exports = {
    server:{
        adresse: process.env.ADRESSE ,
        port: process.env.PORT,
        secret: process.env.SECRET
    },
    database:{
        //mongodb://username:password@host:port/database
        connectionURL: process.env.DATABASE_URL
    }
};