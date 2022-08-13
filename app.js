//INVOCAMOS A EXPRESS JS
const express =  require('express');
const app = express();

//SETEAMOS urlencoded PARA CAPTURAR LOS DATOS DEL FORMULARIO
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//INVOCAMOS A DOTENV
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//EL DIRECTORIO PUBLIC
console.log(__dirname)
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname+'/public'));


//ESTABLECEMOS EL MOTO DE PLANTILLAS ejs
app.set('view-engine', 'ejs');

//INVOCAR EL MODULO PARA HACER HASHING A PASS BCRYPT JS
const bcryptjs = require('bcryptjs');

//VAR. DE SESION
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//INVOCAMOS AL MODULO DE CONEXION DE LA BD
const connection = require('./database/db');

app.get('/',(req, res)=>{
    res.render('index.ejs', {msg:'ESTO ES UN MENSAJE DESDE NODE'});
})

app.get('/login',(req, res)=>{
    res.render('login.ejs');
})

app.get('/register',(req, res)=>{
    res.render('register.ejs');
})

//REGISTRAR
app.post('/register', async(req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const role = req.body.role;
    const pass = req.body.pass;

    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user, name:name, role:role, password:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register.ejs', {
                alert: true,
                alertTitle: "Registro",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta:''
            })
        }
    })

})


app.listen(4000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:4000');
})