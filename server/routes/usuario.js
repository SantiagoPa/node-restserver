const express = require('express');
const bcrypt  = require('bcrypt');
const _       = require('underscore');
const Usuario = require('../models/usuario');
const { verificarToken, verificarAdminRole} = require('../middlewares/autenticaion');

const app = express();


app.get('/usuario', verificarToken , (req, res) => {
   
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // las comillas filtran los resultados, en este caso los que uno quiers mostrar
    Usuario.find({ estado: true }, 'nombre email estado google role')
    .skip(desde)
    .limit(limite)
    .exec( (err,usuarios) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
       
        Usuario.countDocuments({ estado: true}, (err,conteo) =>{

            res.json({
                ok: true,
                usuarios,
                cantidad: conteo
            });
        });


    });

});
  
  
  
app.post('/usuario', [verificarToken, verificarAdminRole], function (req, res)  {
    
    let body = req.body;

    let usuario = new Usuario ({
        nombre:   body.nombre,
        email:    body.email,
        password: bcrypt.hashSync(body.password, 10),
        role:     body.role
    });

    usuario.save((err,usuarioDB)=>{
        if(err){
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
  
app.put('/usuario/:id', [verificarToken, verificarAdminRole], function(req, res) {
      
      let id   = req.params.id;
      let body = _.pick(req.body, ['nombre','img','email','estado','role']);

      Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err,usuarioDB)=>{
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

      });
  
});
  
app.delete('/usuario/:id', [verificarToken, verificarAdminRole], function(req, res) {
    
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err,usuarioDB) =>{ eliminar de la database...

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err,usuarioDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

module.exports = app;