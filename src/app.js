import express from 'express';
import cors from 'cors';
import passport from 'passport';
import initializePassport from './config/passport-config.js';
import sessionRouter from './routes/session.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/carts.js'
import cookieParser from 'cookie-parser';
import __dirname from './utils.js';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io'; 
import { productsService } from './services/services.js';
import { createLogger } from './logger.js';

const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`));

const logger = createLogger();

export const io = new Server(server)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname+'/views')


app.use(express.json());
app.use('/images', express.static(__dirname+'/public'))
app.use('/avatar/', express.static(__dirname + '/public'))
app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use('/session',sessionRouter);
app.use('/product',productsRouter);
app.use('/cart',cartRouter);


io.on('connection', async socket => {
    console.log(`the socket ${socket.id} is connected`)
    let allProducts = await productsService.getAll()
    socket.emit('deliverProducts', allProducts)
})

//Render Views
app.get('/', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/logout', (req, res) => {
    res.render('logout')
})

app.get('/home', (req, res) => {
    res.render('home')
})

app.use('/*', (req,res)=> res.send({
    error:-2,
    description: `Path ${req.originalUrl} and method ${req.method} aren't implemented`
}))

//GRAPHQL

// import {graphqlHTTP} from "express-graphql";
// import {buildSchema} from "graphql";

// let clients = [];
// let counter = 1;
// let schema = buildSchema(`
//     type Client{
//         id:Int
//         name:String
//         phone:String
//     }
//     type Query{
//         clients:[Client]
//         clientById(id:Int):Client
//     }
//     type Mutation{
//         addClient(name:String,phone:String):Client
//     }
// `)

// const root ={
//     clients: () => clients,
//     clientById:(data)=>{
//         for(let i=0;i<clients.length;i++){
//             if(clients[i].id===data.id) return clients[i]
//         }
//         return null;
//     },
//     addClient:(data)=>{
//         let client={"id":counter,"name":data.name,"phone":data.phone}
//         clients.push(client);
//         counter++;
//         return client;
//     }
// }

// app.use('/graphql',graphqlHTTP({
//     schema:schema,
//     rootValue:root,
//     graphiql:true
// }))

// let schema = buildSchema(`
//     type User{
//         id:Int
//         first_name:String
//         last_name:String
//         username:String
//         address:String
//         age:Int
//         email:String
//         password:String
//         phone:String
//     }
//     type Query{
//         users:[User]
//         userById(id:Int):User
//     }
//     type Mutation{
//         adduser(first_name:String,last_name:String,username:String,address:String,age:Int,email:String,password:String,phone:String):User
//     }
// `)
// const root ={
//     users: () => users,
//     userById:(data)=>{
//         for(let i=0;i<users.length;i++){
//             if(users[i].id===data.id) return users[i]
//         }
//         return null;
//     },
//     addUser:(data)=>{
//         let user={"id":counter,"first_name":data.first_name,"last_name":data.last_name,"username":data.username,"age":data.age,"email":data.email,"password":data.password,"phone":data.phone}
//         users.push(user);
//         counter++;
//         return user;
//     }
// }

// mutation{
//     addUser(first_name:"Matias",last_name:"Urbano",username:"mati01",address:"asdas",age:25,email:"a@b.com",password:"123",phone:"123141"){
//         id
//     }
// }

// mutation{
//     addClient(first_name:"Matias",last_name:"Urbano",username:"mati01",address:"asdas",age:25,email:"a@b.com",password:"123",phone:"123141"){
//         id
//     }
// }