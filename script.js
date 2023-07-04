window.onload = function() {
  // Obtém o elemento do título da lista
  var listTitle = document.getElementById('list-title');

  // Obtém o elemento do conteúdo da lista
  var listContent = document.getElementById('list-content');

  // Obtém todos os botões da barra lateral
  var sidebarButtons = document.getElementsByClassName('sidebar-button');

  // Adiciona um ouvinte de evento de clique a cada botão
  for (var i = 0; i < sidebarButtons.length; i++) {
    sidebarButtons[i].addEventListener('click', function() {
      // Obtém o nome da lista associado ao botão clicado
      var selectedList = this.getAttribute('data-list');

      // Verifica qual botão foi clicado
      if (selectedList === '+') {
        // Redireciona para a página de criação de nova lista
        window.open("novalist.html","_blank");
      } else {
        // Atualiza o título e conteúdo da lista com uma mensagem genérica
        listTitle.textContent = selectedList;
        listContent.textContent = 'Conteúdo da ' + selectedList;
      }
    });
  }
};

