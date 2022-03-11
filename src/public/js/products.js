const form = document.getElementById('insertProduct')
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form)

    const product = {
        producName:formData.get('producName'),
        description:formData.get('description'),
        code:formData.get('code'),
        price:formData.get('price'),
        stock:formData.get('stock'),
        image:formData.get('image')
    }
    
    if (!product.producName || !product.description || !product.code || !product.price || !product.stock || product.image.size === 0) {
        alert("datos incompletos")
    }
     else {
        fetch('/product/', {
        method: 'POST',
        body: formData
        }).then(result => result.json()).then(response => {
            form.reset()
            alert("Producto añadido")
        })
    }

})
