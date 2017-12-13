module.exports = {
    server:{
        adresse: "http://localhost",
        port: 3001,
        secret: "secrettest"
    },
    database:{
        //mongodb://username:password@host:port/database
        connectionURL: 'mongodb://localhost:27017/eManualTest'
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
    },
    mail:{
        pool: true,
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ttlrmrc66uz66l3q@ethereal.email',
            pass: '6mrtg7gjPgfAXTm6jw'
        }
    }
};