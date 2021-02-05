
require('./config/config');
const express = require('express')
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
 

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
},(err,res)=>{
    if(err) throw err;
    console.log('base de datos ONLINE');
});

app.use( require('./routes/usuario') );

app.listen(process.env.PORT,()=>{

    console.log('Escuchando el puerto:',3000);

});
