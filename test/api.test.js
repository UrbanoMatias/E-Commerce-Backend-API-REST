import supertest from "supertest";
import chai,{expect} from "chai";


chai.should();
const request = supertest("http://localhost:8080");

describe("TEST API",()=>{
    describe("GET",()=>{
        it("La peticion deberia retornar status 200",async()=>{
            let res = await request.get("/session");
            expect(res.status).to.be.equal(200)
        });
        it("Dede logear un usuario",async()=>{
            let res = await request.get("/session/login")
            expect(res.status).to.equal(200);
        })
    })
    describe("POST",()=>{
        it("Deberia guardar al usuario",async()=>{
            const newUser = {
                first_name:"Matias",
                last_name:"Urbano",
                username:"matiis0707",
                address:"38",
                age:"25",
                phone:"+544644613",
                email:"correos@correo.com",
                password:"123",
                cart:[{id:'622a8ffb4391d78b91df7378'}],
                role:"user"
            }
            let res = await request.post("/session").send(newUser)
            expect(res.status).to.equal(200)
        })
        it("Deberia guardar un producto",async()=>{
            const producto = {
                title:"remera",
                description:"lorem",
                stock:2,
                price:1000,
                code:"r2m2",
                thumbnail:"C:\Users\maty-\OneDrive\Escritorio\remera.jpg"
            }
            let res = await request.post("/product").send(producto)
            expect(res.status).to.equal(200)
        })
    })
})