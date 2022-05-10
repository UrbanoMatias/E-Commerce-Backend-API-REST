const socket = io()

let userName = document.getElementById('userName')
let avatar = document.getElementById('avatar')
let email = document.getElementById('email')

fetch('/session/current').then(response => response.json())
.then(data => {
    userName.innerHTML = data.first_name
    avatar.innerHTML = `<img src="../avatar/${data.avatar}" class="w-25" alt="">`
    email.innerHTML = data.email
})

let productImage = document.getElementById('productImage');
let productTitle = document.getElementById('productTitle');
let productDesc = document.getElementById('productDesc');
let price = document.getElementById('price');
// let catalogo = document.getElementById('productTable')

fetch('/product/').then(response => response.json())
.then(data => {
    data.map(element => element)
    console.log(data)
})

// socket.on('deliverProducts', data => {
//     fetch('/templates/productsTable.handlebars')
//     .then(string => string.text())
//     .then(template => {
//         const processedTemplate = Handlebars.compile(template)
//         const templateObj = {
//             products:data
//         }
//         const html = processedTemplate(templateObj)
//         let div = document.getElementById('productTable')
//         div.innerHTML = html
//     })
// })