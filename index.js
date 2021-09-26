// npm install express
// npm install jsonwebtoken
// npm install nodemonnpm install -g nodemon
// npm install body-parser
// npm install npm install express-mysql-session --save
// npm install mysql
const express = require('express');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const bodyParser=require('body-parser');
const bcrypt = require('bcrypt');
var connection = require('./config');

//const authenticateController = require('./controllers/authenticate-controller');
const registerController = require('./controllers/register-controller');



const app = express()
const port = 3000



// middleware para loggear los eventos del servidor
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
 
app.get('/', (req, res) => {
  res.send('<h1>Servidor funcionando</h1>')
})

// Crear nuevo usuario
app.post('/api/register',registerController.register);



// Autenticar usuario

app.post('/api/auth/login', (req, res)=> {
    let usuario = req.body.usuario;
    let password = req.body.password;
    console.log(usuario);
    console.log(password);    
    if (esValido(usuario, password)){
        console.log('Logeando....');
        jwt.sign({usuario}, 'secretkey', (err, token)=>{
            res.json({
                token
            });
        });    
    }else{
        // 401 no autorizado
        res.sendStatus(401);
    }
})

// ---------------------------------------------------------------------------------------
// no funciona como debería
function esValido(usuario, password){
    let veri = false;
    console.log('Verificando contraseña...');
    var sql='SELECT * FROM usuario WHERE usuarioNombre =?';
    console.log(usuario, password);
    // -----------------------------------------------------------------------------
    // esto lo ejecuta después de lo debido
    connection.query(sql, usuario, function (err, result, fields) {
        console.log('Comparando Datos...');             
        Object.keys(result).forEach(function(key) {
            var row = result[key];  
            console.log('Veri antes de iniciar');
            console.log(veri);          
            console.log('Iteracion:');
            console.log(key);
            console.log(row.usuarioId);
            console.log(row.usuarioNombre);
            console.log(row.passwordHash);
            console.log(row.passwordSalt);
            if (veri==false){
                veri = bcrypt.compareSync(password, row.passwordHash);
                console.log('se imprime veri por unica vez a menos que de falso');
                console.log(veri);
            }  
          });         
    })   
    // -----------------------------------------------------------------------------
    console.log('se imprime veri antes de retornar');
    console.log(veri);
    return veri
}
// ---------------------------------------------------------------------------------------

// Genera un nuevo token
app.post('/auth/generarToken', (req, res)=> {
    const usuario = {
        usuario: 'Juan',
        correo: 'correojuan@mail.com'
    }

    jwt.sign({usuario}, 'secretkey', (err, token)=>{
        res.json({
            token
        });
    });
})


// Verifica la validez del token
app.post('/auth/verificarToken', verificarToken, (req, res)=>{    
    jwt.verify(req.token, 'secretkey', (err, authDatos)=>{
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                mensaje: "Token válido",
                authDatos: authDatos
            })
        }
    });
})

//Authorization: Bearer <token>
function verificarToken (req, res, next){
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(bearerHeader, " ")[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
};

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})

