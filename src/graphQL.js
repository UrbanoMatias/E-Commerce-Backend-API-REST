import express from "express";
import {graphqlHTTP} from "express-graphql";
import {buildSchema} from "graphql";


const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`));


let clients = [];
let counter = 1;
let schema = buildSchema(`
    type Client{
        id:Int
        first_name:String
        last_name:String
        username:String
        address:String
        age:Int
        email:String
        password:String
        phone:String
    }
    type Query{
        clients:[Client]
        clientById(id:Int):Client
    }
    type Mutation{
        addClient(first_name:String,last_name:String,username:String,address:String,age:Int,email:String,password:String,phone:String):Client
    }
`)

const root ={
    clients: () => clients,
    clientById:(data)=>{
        for(let i=0;i<clients.length;i++){
            if(clients[i].id===data.id) return clients[i]
        }
        return null;
    },
    addClient:(data)=>{
        let client={"id":counter,"first_name":data.first_name,"last_name":data.last_name,"username":data.username,"age":data.age,"email":data.email,"password":data.password,"phone":data.phone}
        clients.push(client);
        counter++;
        return client;
    }
}

const products = [];
let productSchema = buildSchema(`
    type Product{
        id:Int
        name:String
        description:String
        price:Int
        stock:Int
    }
    type Query{
        products:[Product]
    }
    type Mutation{
        addProduct(name:String,description:String,price:Int,stock:Int):Product
    }
`)

const productRoot ={
    products: () => products,
    addProduct:(data)=>{
        let product={"id":counter,"name":data.name,"description":data.description,"price":data.price,"stock":data.stock}
        products.push(product);
        counter++;
        return product;
    }
}

app.use('/graphql',graphqlHTTP({
    schema:productSchema,
    rootValue:productRoot,
    graphiql:true
}))