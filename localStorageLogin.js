
function entrar(){
  let email = document.getElementById("email");  
  let senha = document.getElementById("password");
  
  let msgError = document.querySelector('#msgError')
  let users = JSON.parse(localStorage.getItem("users"));

  for(i=0;i<users.length;i++){
  console.log(users[i].name)
}
  
  const verifyLogin = (e) =>{
    e.preventDefault();
    for(i=0;i<users.length;i++){
      if(email.value === users[i].email && users[i].password === senha){
        window.location.href = `home.html?id=${userId}`;
      }
    }
  }

  
}