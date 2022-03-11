let userName = document.getElementById('userName')
let avatar = document.getElementById('avatar')
let email = document.getElementById('email')
let carrito = document.getElementById('carrito')
const socket = io()

fetch('/session/current').then(response => response.json())
.then(data => {
    userName.innerHTML = data.first_name
})

fetch('/session/current').then(response => response.json())
.then(data => {
        console.log(data.cart)
        data.cart.map( product => {
        fetch(`/product/${product.id}`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            carrito.innerHTML += `<div class="card w-25 text-center m-1 shadow">
                                    <h3>${data.title}</h3>
                                    <p>price: ${data.price}</p>
                                    <img src=${data.thumbnail} alt="">
                                </div>`
        })
    })
})

const confirm = () => {
    fetch('/session/current')
    .then(response => response.json())
    .then(data => 
                {
                console.log(data)
                location.href=`/cart/${data._id}/confirm`
            })
}