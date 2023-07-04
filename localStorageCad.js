let nome = document.getElementById("name");
let validNome = false;

let email = document.getElementById("email");
let validEmail = false;

let senha = document.getElementById("password");
let validSenha = false;

let confirmSenha = document.getElementById("confirmPassword");

let msgError = document.querySelector('#msgError');
let msgSuccess = document.querySelector('#msgSuccess');

window.addEventListener('DOMContentLoaded', () => {
  nome.value = localStorage.getItem('name') || '';
  email.value = localStorage.getItem('email') || '';
  senha.value = localStorage.getItem('password') || '';
});

nome.addEventListener('keyup', () => {
  if (nome.value.length <= 2) {
    nome.setAttribute('style', 'border-color: red');
    validNome = false;
  } else {
    nome.setAttribute('style', 'border-color: green');
    validNome = true;
  }
});

email.addEventListener('keyup', () => {
  if (email.value.length <= 4) {
    email.setAttribute('style', 'border-color: red');
    validEmail = false;
  } else {
    email.setAttribute('style', 'border-color: green');
    validEmail = true;
  }
});

senha.addEventListener('keyup', () => {
  if (senha.value.length <= 5) {
    senha.setAttribute('style', 'border-color: red');
    validSenha = false;
  } else {
    senha.setAttribute('style', 'border-color: green');
    validSenha = true;
  }
});

confirmSenha.addEventListener('keyup', () => {
  if (senha.value != confirmSenha.value) {
    confirmSenha.setAttribute('style', 'border-color: red');
    validConfirmSenha = false;
  } else {
    confirmSenha.setAttribute('style', 'border-color: green');
    validConfirmSenha = true;
  }
});

function cadastrar(e) {
  e.preventDefault();

  if (validNome && validEmail && validSenha && validConfirmSenha) {
    const userData = {
      id: Date.now(),
      name: nome.value,
      username: "", // Adicione o valor desejado para o campo de nome de usuário aqui
      email: email.value,
      password: senha.value
    };

    let userList = JSON.parse(localStorage.getItem('users') || '[]');
    userList.push(userData);
    localStorage.setItem('users', JSON.stringify(userList));

    msgSuccess.setAttribute('style', 'display: block');
    msgSuccess.innerHTML = '<strong>Cadastrando usuário...</strong>';
    msgError.setAttribute('style', 'display: none');
    msgError.innerHTML = '';

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  } else {
    msgError.setAttribute('style', 'display: block');
    msgError.innerHTML =
      '<strong>Preencha todos os campos corretamente antes de cadastrar</strong>';
    msgSuccess.innerHTML = '';
    msgSuccess.setAttribute('style', 'display: none');
  }
}
