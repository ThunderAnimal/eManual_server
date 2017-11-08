module.exports = {
    server:{
        adresse: process.env.ADRESSE || "http://localhost",
        port:  process.env.PORT || 3000,
        secret: process.env.SECRET || "1234secretsupersecret"
    },
    database:{
        //mongodb://username:password@host:port/database
        connectionURL: process.env.DATABASE_URL || 'mongodb://localhost:27017/eManual'
    }
};