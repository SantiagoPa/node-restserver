
// ====================
//  Puerto
// ====================

process.env.PORT = process.env.PORT || 3000;

// ====================
//  Entorno
// ====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
//  database
// ====================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    
    urlDB = 'mongodb://localhost:27017/cafe';

}else{

    urlDB= 'mongodb+srv://firstUser-01:bgsI61ja7VDJHNvq@cluster-01.zsupo.mongodb.net/cafe?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB