const express = require('express');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

const app = express()
const port = 3000

// middleware para loggear los eventos del servidor
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
 
app.get('/', (req, res) => {
  res.send('<h1>Servidor funcionando</h1>')
})

// Crear nuevo usuario

// Autenticar usuario
app.post('/api/auth/login', (req, res)=> {
    let usuario = req.body.usuario;
    let password = req.body.password;
    
    if (esValido(usuario,password)===true){
        console.log('Entrando al generador');
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

function esValido(usuario, password){
    console.log(usuario);
    console.log(password);
    console.log((usuario==password));
/* 
    if (usuario !== '' || password !== ''){
        return (false);
    }
*/   
    return (usuario==password);
}

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

