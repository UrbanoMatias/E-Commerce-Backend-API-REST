const form = document.getElementById('registerForm')
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form)

    const user = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        password: formData.get('password'),
        age: formData.get('age'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        avatar: formData.get('avatar')
    }

    if (!user.first_name || !user.last_name || !user.email || !user.password || !user.age || user.avatar.size === 0) {
        alert("datos incompletos")
    }
     else {
        fetch('/session/', {
        method: 'POST',
        body: formData
        }).then(result => result.json()).then(response => {
            form.reset()
            alert("Usuario registrado")
        })
    }

})

