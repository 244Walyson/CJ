
$(document).ready(function () {

  $('#save-btn').click(function (e) { 
    e.preventDefault();
    document.getElementById('save-modal').show()
    document.getElementById('overlay').style.display = 'block';
  });
  $('#close-save-modal').click(function (e) { 
    e.preventDefault();
    document.getElementById('save-modal').close()
    document.getElementById('overlay').style.display = 'none';
  });
  $('#save-form').submit(function (e) { 
    e.preventDefault();
    document.getElementById('save-modal').close()
    document.getElementById('overlay').style.display = 'none';
    SaveList(e.target.list_title.value)
    window.location.href = 'verlist.html'
  });
  $('#save-modal-cancelbtn').click(function (e) { 
    e.preventDefault();
    document.getElementById('save-modal').close()
    document.getElementById('overlay').style.display = 'none';
  });


  $('#share-btn').click(function (e) { 
    e.preventDefault();
    document.getElementById('share-modal').show()
    document.getElementById('overlay').style.display = 'block';
  });
  $('#close-share-modal').click(function (e) { 
    e.preventDefault();
    document.getElementById('share-modal').close()
    document.getElementById('overlay').style.display = 'none';
  });
  $('#share-modal-cancelbtn').click(function (e) { 
    e.preventDefault();
    document.getElementById('share-modal').close()
    document.getElementById('overlay').style.display = 'none';
  });
  $('#share-form').submit(function (e) { 
    e.preventDefault();
    const prompt = e.target.colabInput.value
    if(prompt){
      const users = JSON.parse(localStorage.getItem('users'))
      const user = users.find(user => user.username == prompt)
      console.log(user)
      if(user != undefined){
        if(user.id != gUSER){
          if(!user.colabLists.find(list => list == HASH)){
            user.colabLists.push(HASH)
            localStorage.setItem('users', JSON.stringify(users))
          }
        }
        else
          alert('Você não pode compartilhar com você mesmo')
      }
      else
        alert('Esse usuário não existe')
    }

    document.getElementById('share-modal').close()
    document.getElementById('overlay').style.display = 'none';
    $(e.target.colabInput).val('');
  });
  $('#clipboard_btn').click(function (e) { 
    e.preventDefault();
    navigator.clipboard.writeText(HASH)
    document.getElementById('share-modal').close()
    document.getElementById('overlay').style.display = 'none';
  });


  $('#export-btn').click(function (e) { 
    e.preventDefault();
    BuildPrint()
  });


  $('#customProduct').submit(function (e) { 
    e.preventDefault();

    const prompt = e.target.product.value
    if(prompt){
      const text = prompt.charAt(0).toUpperCase() + prompt.slice(1)   
      const produtosData = JSON.parse(localStorage.getItem("produtos"))
      const value = $('div[data-id="' + SELECTED_CARD + '"] input').val()
  
      if(ValidateNewProduct(produtosData[value], text)){
        produtosData[value].push(text)
        localStorage.setItem('produtos', JSON.stringify(produtosData))
  
        const element = document.createElement('li')
        element.innerHTML = `
                            <a role="button" onclick="AddProduct(this)">
                              ${text} <i class="fa-solid fa-plus"></i>
                            </a>`
  
        //$('#itens-list').append(element);
        ShowProducts(value)
        AddProduct(element.firstElementChild)
        AddedProduct()
      }
    }
  });

  GenerateHash()
  GetIDs()
});

const ValidateNewProduct = (list, product) => {
  if(list.find(item => item === product))
    return false
  
  return true
}

/////////////////////////////////////////
var HASH
const GenerateHash = () => {
  let list
  do {
    const random = Math.floor(Math.random() * 8999 + 1000)
    HASH = '#' + random.toString() + 'L'

    list = JSON.parse(localStorage.getItem('lists')).find(list => list.id == HASH)
  } while (list != undefined);

  $('#hash').val(HASH);
}

/////////////////////////////////////////
var gUSER
var gLIST
const GetIDs = () => {
  const urlParams = new URLSearchParams(window.location.search)

  gUSER = parseInt(urlParams.get('userID'))
  gLIST = urlParams.get('listID')

  //gUSER = 1
  //gLIST = '#7818L'

  if(!gUSER)
    window.location.href = 'login.html'

  const users = JSON.parse(localStorage.getItem('users'))
  users.forEach(user => {
    if(user.id == gUSER){
      $('#username').text(user.name);
    }
  })

  if(gLIST)
    LoadList(gLIST)
  
  const lists = JSON.parse(localStorage.getItem('lists'))

  console.log(users)
  console.log(lists)
}

const LoadList = (listID) => {
  if(!ValidateEdition())
    window.location.href = 'login.html'

  const list = JSON.parse(localStorage.getItem('lists')).find(list => list.id == gLIST)

  if(list){
    $('#list_title').val(list.title);
    HASH = listID
    $('#hash').val(HASH);

    list.sections.forEach(section => {
      SELECTED_CARD = section.id
      CARD_ID = section.id
      if(section.id != 1)
        NewCard()
      
      $('div[data-id="' + SELECTED_CARD + '"] input').val(section.section);
      section.products.forEach(product => {
        const element = document.createElement('a')
        element.innerHTML = `<a role="button" onclick="AddProduct(this)">
                              ${product} <i class="fa-solid fa-plus"></i>
                            </a>`
        AddProduct(element)
      })
    })
  }
}

const ValidateEdition = () => {
  const user = JSON.parse(localStorage.getItem('users')).find(user => user.id == gUSER)
  const own = user.lists.find(listID => listID == gLIST)
  const colab = user.colabLists.find(listID => listID == gLIST)

  if(colab){
    $('#share-btn').remove();
    $('#list_title').prop('disabled', true);
  }

  if(own || colab)
    return true

  return false
}

/////////////////////////////////////////
let CARD_ID = 2
const NewCard = () => {
  const card = `
  <div class="card" data-id="${CARD_ID++}" onclick="ProcessSuggestion(this)">
    <div class="card-title">
        <input type="text" class="card-input" autocomplete="off" placeholder="digite alguma seção de mercado..." onkeydown="EnterPressed(event)" oninput="PredictText(this)">
        <span id="suggestion" class="card-suggestion"></span>
    </div>
    <div class="card-body">
      <ul class="list">

      </ul>
    </div>
    <div class="card-button">
        <button class="new-card" onclick="NewCard()">Nova seção</button>
        <button class="delete-card" onclick="RemoveCard(this)">
          <i class="fa-solid fa-trash-can"></i>
        </button>
    </div>
  </div>
  `
  $('main').append(card);
}

////////////////////////////////
let produtosData = localStorage.getItem("produtos");
let produtos = {};

if (produtosData) {
  produtos = JSON.parse(produtosData);
}

let secoes = Object.keys(produtos);


let words = secoes;

words.sort()
  
const clearSuggestion = (e) => {
    e.innerHTML = ""
};

const PredictText = (input) => {
  clearSuggestion(input.nextElementSibling)
    //Convert input value to regex since string.startsWith() is case sensitive
  let regex = new RegExp("^" + input.value, "i")
  //loop through words array
  for (let i in words) {
    //check if input matches with any word in words array
    if (regex.test(words[i]) && input.value != "") {
      //console.log()
      input.nextElementSibling.innerHTML = words[i]
      break
    }
  }
}

let enterCount = 0;
const enterKey = 13
const EnterPressed = (e) => {
  //When user presses enter and suggestion exists
  if (e.keyCode == enterKey && suggestion.innerText != "") {
    e.preventDefault()
    //input.value = suggestion.innerText
    e.target.value = e.target.nextElementSibling.innerText
    //clear the suggestion
    clearSuggestion(e.target.nextElementSibling)
    
    ShowProducts(e.target.value)
  }
}

//////////////////////////////////////////
let SELECTED_CARD = 1
ProcessSuggestion = (element) => {
  SELECTED_CARD = $(element).data('id');

  if(element.firstElementChild.firstElementChild.value != ''){
    ShowProducts(element.firstElementChild.firstElementChild.value)
    AddedProduct()
  }
}

const ShowProducts = (prompt) => {
  $('#itens').css('display', 'flex');
  $('#itens-list').empty();

  const produtosData = JSON.parse(localStorage.getItem("produtos"))
  const products = produtosData[prompt].sort()
  
  products.forEach(product => {
    const element = `<li>
                        <a role="button" onclick="AddProduct(this)">
                          ${product} <i class="fa-solid fa-plus"></i>
                        </a>
                    </li>`

    $('#itens-list').append(element);
  })
}

const AddedProduct = () => {
  //ve se algum produto já foi selecionado
  $('div[data-id="' + SELECTED_CARD + '"] .list li a').each(function() {
    const cardText = $(this).text().trim()
    $('#itens-list li a').each(function(){
      const listText = $(this).text().trim()

      if(cardText === listText)
        $(this).addClass('unclick')
    })
  })
}

const AddProduct = (element) => {
  const element_li = `<li>
                        <a role="button">
                          ${element.text} 
                          <i class="fa-solid fa-trash" onclick="RemoveProduct(this)"></i>
                        </a>
                      </li>`
  AddedProduct()
  $(element).addClass('unclick')
  $('div[data-id="' + SELECTED_CARD + '"] .list').append(element_li);
}

const RemoveProduct = (element) => {
  $(element.parentNode.parentNode).remove();
  AddedProduct()
}

const RemoveCard = (element) => {
  alert('Você tem certeza que deseja excluir essa sessão?')
  $(element.parentNode.parentNode).remove();
}

//////////////////////////////////////////
const SaveList = (title) => {
  const lists = JSON.parse(localStorage.getItem('lists'))
  const users = JSON.parse(localStorage.getItem('users'))
  const user = users.find(user => user.id == gUSER)
  const list_data = SaveData(title)

  if(gLIST){
    const list = lists.find(list => list.id == gLIST)
    const index = lists.indexOf(list)
    lists.splice(index, 1)
  }
  else
    user.lists.push(HASH)

  lists.push(list_data)
  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('lists', JSON.stringify(lists))
}

const SaveData = (title) => {
  data = {
    title: title,
    id: HASH,
    creation_date: GetDate(),
    ownerID: gUSER,
    sections: []
  }

  $('main .card').each(function(){
    card = {
      section: this.firstElementChild.firstElementChild.value,
      id: parseInt($(this).data('id')),
      products: []
    }

    const lis = this.children[1].firstElementChild.children
    for(let li of lis){
      card.products.push(li.firstElementChild.text.trim())
    }

    data.sections.push(card)
  })
  return data
}

const GetDate = () => {
  const dataAtual = new Date();

  const dia = dataAtual.getDate();
  const mes = dataAtual.getMonth() + 1;
  const ano = dataAtual.getFullYear();
  const hora = dataAtual.getHours();
  const minutos = dataAtual.getMinutes();
  
  return `${dia}/${mes}/${ano} ${hora}:${minutos}` 
}

/////////////////////////////////////

const BuildPrint = () => {
  const content = document.createElement('div')

  $(content).append(`<h2>${GetDate()}<h2>`);
  $(content).append('<br>');
  
  $('main .card').each(function (index, element) {
    const subcontent = document.createElement('div')
    $(subcontent).css('padding-left', '25%');

    $(subcontent).append(`<h3>${this.firstElementChild.firstElementChild.value}</h3>`);
    $(subcontent).append('<hr>');

    const lis = this.children[1].firstElementChild.children
    for(let li of lis){
      $(subcontent).append(li.firstElementChild.text.trim());
      $(subcontent).append('<br>');
    }

    $(subcontent).append('<br>');
    $(content).append(subcontent);
  });

  console.log(content)
  html2pdf(content)
}