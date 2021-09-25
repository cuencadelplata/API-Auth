const express = require('express');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

const app = express()
const port = 3000

// middleware para loggear los eventos del servidor
app.use(morgan('dev'));
app.use(express.json());


app.get('/', (req, res) => {
  res.send('<h1>Servidor funcionando</h1>')
})

app.post('/auth/generarToken', (req, res)=> {
    const usuario = {
        usuario: 'Eduardo',
        correo: 'correojuan@mail.com'
    }

    jwt.sign({usuario}, 'secretkey', (err, token)=>{
        res.json({
            token
        });

    });
})

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
