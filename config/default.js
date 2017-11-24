module.exports = {
    server:{
        adresse: process.env.ADRESSE || "http://localhost",
        port:  process.env.PORT || 3000,
        secret: process.env.SECRET || "1234secretsupersecret"
    },
    database:{
        //mongodb://username:password@host:port/database
        connectionURL: process.env.DATABASE_URL || 'mongodb://localhost:27017/eManual'
    },
    oauth:{
        google:{
            client_id : '148327907418-tkqsif4pf4u0h5ga4985qcccero2tp71.apps.googleusercontent.com',
            client_secret: 'o-sqQXib8JyAUsjHcBs76U0q'
        },
        facebook:{
            client_id : '2077525315801631',
            client_secret: '8eb4126dcf1db4f7755e35ccbda8ee92'
        }
    }
};