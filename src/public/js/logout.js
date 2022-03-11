let logout = document.getElementById('logout');
logout.addEventListener('click',function(){
    fetch('/session/logout').then(result=>result.json()).then(json=>{
        console.log(json);
        location.replace('../index.html')
    })
})