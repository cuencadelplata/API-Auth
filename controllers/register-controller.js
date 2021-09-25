var connection = require('./../config');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.register=function(req,res){
contraseña = req.body.password;
    bcrypt.genSalt(saltRounds, function(err, salt) {  
        bcrypt.hash(contraseña, salt, function(err, hash) {
            var usuario={
                "usuarioNombre":req.body.usuario,
                "passwordHash": hash,
                "passwordSalt": salt
            }
          // Store hash in database here
          connection.query('INSERT INTO usuario SET ?',usuario, function (error, results, fields) {
            if (error) {
              res.json({
                  status:false,
                  message:'there are some error with query'
              })
            }else{
                res.json({
                  status:true,
                  data:results,
                  message:'user registered sucessfully'
              })
            }
          });
        });
      }); 
}