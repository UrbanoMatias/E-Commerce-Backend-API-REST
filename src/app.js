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