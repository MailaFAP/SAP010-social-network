import './feed.css';
import { userLogout, getUserName, getUserId } from '../../lib/authUser.js';
import { posts, exibAllPosts, deletePost, updatePost, likePost } from '../../lib/firestore.js';

import logocontraplano from '../../img/icon_logo_contraplano.png';
import perfilicon from '../../img/icons/icones-user1.svg';
import commentarea from '../../img/icons/icones-comment.svg';
import newposticon from '../../img/icons/icones-send.svg';
import logouticon from '../../img/icons/icones-logout.svg';
import likeiconon from '../../img/icons/icones-like1.svg';
import likeiconoff from '../../img/icons/icones-like2.svg';
import editicon from '../../img/icons/icones-edit.svg';
import deleteicon from '../../img/icons/icones-delete.svg';

export default () => {
  const oldStyles = document.getElementsByTagName("link");
  if (oldStyles.length > 1) oldStyles[1].remove();
  const stylesheet = document.createElement('link');
  stylesheet.setAttribute('rel', 'stylesheet');
  stylesheet.setAttribute('type', 'text/css');
  stylesheet.setAttribute('href', 'pages/Feed/feed.css');
  document.head.appendChild(stylesheet);

  const feedContainer = document.createElement('div');
  const templateFeed = `
  <header class="headerfeed">
      <picture><img class="logofeed" src="${logocontraplano}"></picture>
      <div>
        <h3> Feed </h3>
        <p>Oi, ${getUserName()}! Vamos comentar sobre filmes e séries?</p>
      </div>
  <section>
  <div id="notification" class="notification hidden"></div>
    <button class="btn-perfil" id="btn-perfil"><img class="icon" title="Perfil" src="${perfilicon}"></button>
    <button class="btn-logout" id="btn-logout"><img class="icon" title="Log Out" src="${logouticon}"></button>
  </section>
  </header>
  <section class="inicioFeed">
  </section>
  <div id="new-comment">
  <button class="btn-post" id="btn-new-comment-area">
    <img class="icon" id="new-comment-icon" alt='new comment area icon' title="Criar novo post" src="${commentarea}">
  </button>
  </div>
  <div id="postagens" class="hidden">
    <textarea class="inputMensagem" id="textoMensagem" placeholder="Ei, me conta o que você tem assistido..." rows="8" cols="45"></textarea>
    <button class="btn-delete" id="btn-clean-delete"><img class="icon" alt='clean area icon' title="Limpar área de texto" src="${deleteicon}"></button>
    <button class="btn-post" id="btn-send-post"><img class="icon" alt='new post icon' title="Publicar novo post" src="${newposticon}"></button>
  </div>
    <section id="listPosts" class="posts">
    </section>
  <footer>
    <h6>Desenvolvido por: Larissa Velace | Maila Ferreira | Vitória Victor</h6>
    <h6>Bootcamp Laboratoria - Projeto Rede Social - 2023</h6>
  </footer>
  </div>`;


  feedContainer.innerHTML = templateFeed;

  //para funcionar os posts  
  const listPosts = feedContainer.querySelector('#listPosts');

  // Informações preenchidas pelo usuário
  const textoMensagemEntrada = feedContainer.querySelector('#textoMensagem');


  // Botões
  const btnPost = feedContainer.querySelector('#btn-send-post');
  const btnCleanDelete = feedContainer.querySelector('#btn-clean-delete');
  const btnLogout = feedContainer.querySelector('#btn-logout');
  const btnPerfil = feedContainer.querySelector('#btn-perfil');

  const createPostElement = (
    nameUser,
    date,
    textPost,
    postId,
    uidUser,
    whoLiked,
  ) => {
    const createdAtDate = date.toDate();
    const createdAtFormattedDate = createdAtDate.toLocaleDateString('pt-BR');
    const createdAtFormattedTime = createdAtDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const createdAtFormatted = `${createdAtFormattedDate} ~ ${createdAtFormattedTime}`;
    const postElement = document.createElement('div');
    postElement.innerHTML = `
    <section class="post-container">
      <div class='nameUser'>
        <p class='userName'>${nameUser}</p>
        
        <p class='textPost'>${textPost}</p>
      </div>
      <div class='icons'>
      <!-- Botão de like e contador de likes -->
      <button type='button' class='icons-post' id='btn-like-post' data-post-id='${postId}'>
      <div class='icon-post' id='icons-like'>
        <img alt='like icon' class='icon' title="Like" data-like-state="off" src="${likeiconoff}"/>
        <span id="likes-counter-${postId}">${whoLiked.length}</span> likes
      </div>
    </button>
    
    </button>
      <!-- Botão de editar e deletar para uid do usuario autor -->
          ${uidUser === getUserId() ? `
          <button class="btn-post" 
          id="btn-edit-post" 
          data-remove="postId" data-post-id='${postId}' data-user-id='${uidUser}'><img alt='edit icon' class='icon' title="Editar publicação" src="${editicon}"></button>
          <button class="btn-post" 
            id="btn-delete-post" 
            data-post-id='${postId}' data-user-id='${uidUser}'>
            <img alt='delete icon' class='icon' title="Deletar publicação" src="${deleteicon}"></button> 
            <div class="edit-area">
            <h4 class="edit-title" style="display: none;">Opa! Bora lá editar a publicação?</h4>
              <textarea class="edit-textarea" style="display: none;" rows="4" cols="30"></textarea>
              <div class="edit-buttons" style="display: none;">
                <button class="btn-edit-save">Salvar</button>
                <button class="btn-edit-cancel">Cancelar</button>
              </div>
            </div>
            <div class="delete-area">
              <div class="delete-buttons" style="display: none;">
                <h4>Ei! Quer excluir sua publicação?</h4>
                <button class="btn-delete-confirm">Confirmar</button>
                <button class="btn-delete-cancel">Cancelar</button>
              </div>
            </div>` : ''}
      </div>
      <p class='dataPost'>${createdAtFormatted}</p>
    </section>`;

    // LIKE EM POSTS: dar likes em publicações
    const likeButton = postElement.querySelector('#btn-like-post');
    const likesCounter = postElement.querySelector(`#likes-counter-${postId}`);
    const likeIcon = postElement.querySelector('.icon-post img');

    // Evento de escuta para o botão de like
    likeButton.addEventListener('click', async () => {
      try {
        const likeResult = await likePost(postId, getUserId());
        if (likeResult === 'add like') {
          likesCounter.innerText = parseInt(likesCounter.innerText, 10) + 1;
          likeIcon.dataset.likeState = 'on';
          likeIcon.src = likeiconon;
        } else if (likeResult === 'remove like') {
          likesCounter.innerText = parseInt(likesCounter.innerText, 10) - 1;
          likeIcon.dataset.likeState = 'off';
          likeIcon.src = likeiconoff;
        }
      } catch (error) {
        showNotification('Ops, não rolou o like', 'error');
        console.error(error);
      }
    });

    return postElement;
  };


  //lista de publicações aqui
  const inicioPosts = () => {
    exibAllPosts()
      .then((listaPosts) => {
        listPosts.innerHTML = ''; // Limpar a lista de posts antes de atualizar
        for (let i = listaPosts.length - 1; i >= 0; i--) {
          const itemPost = createPostElement(
            listaPosts[i].nameUser,
            listaPosts[i].date,
            listaPosts[i].textPost,
            listaPosts[i].id,
            listaPosts[i].uidUser,
            listaPosts[i].whoLiked
          );
          listPosts.appendChild(itemPost);
        }
        const listPostRect = listPosts.getBoundingClientRect();
        listPosts.style.maxHeight = `${window.innerHeight - listPostRect.y}px`;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // limpar area de novo post e escutador de acao
  const clearTextarea = () => {
    textoMensagemEntrada.value = '';
  };
  btnCleanDelete.addEventListener('click', clearTextarea);

  //ADD NOVO POST: fazer postagem nova direto do app/web
  btnPost.addEventListener('click', () => {
    const textoPostagem = textoMensagemEntrada.value;
    if (!textoPostagem) {
      showNotification('A barra tá limpa aqui! Escreve umas coisinhas antes de enviar.', 'attention');
    } else {
      posts(textoPostagem)
        .then(() => {
          textoMensagem.value = '';
          showNotification('Eba! Seu post foi publicado!', 'success');
          inicioPosts();
        })
        .catch((error) => {
          showNotification('Ops! Deu ruim aqui na publicação, tente novamente.', 'error');
          console.log(error);
        });
    }
  })

  //DELETAR POST: selecionar e deletar comentário feito pelo proprio usuário
  const handlePostListClick = (event) => {
    const target = event.target;
    const deleteButton = target.closest('#btn-delete-post');

    if (deleteButton) {
      const postId = deleteButton.getAttribute('data-post-id');
      const uidUser = deleteButton.getAttribute('data-user-id');
      const postElement = deleteButton.closest('.post-container');
      //so testando retorno do uid do user no console
      console.log(getUserId(), uidUser);

      if (uidUser === getUserId()) {
        const toggleElementDisplay = (element, displayValue) => {
          element.style.display = displayValue;
        };

        const deleteButtons = postElement.querySelector('.delete-buttons');
        const btnDeleteConfirm = postElement.querySelector('.btn-delete-confirm');
        const btnDeleteCancel = postElement.querySelector('.btn-delete-cancel');

        if (postElement.classList.contains('deleting')) {
          toggleElementDisplay(deleteButtons, 'none');
        } else {

          toggleElementDisplay(deleteButtons, 'block');
          // botão confirmar delete
          btnDeleteConfirm.addEventListener('click', () => {
            deletePost(postId)
              .then(() => {
                target.closest('.post-container').remove();
                showNotification('Prontinho! Seu post excluído!', 'success');
              })
              .catch((error) => {
                showNotification('Erro ao excluir o post, tente novamente.', 'error');
                console.error(error);
              });
          });

          // Evento para o botão "Cancelar"
          btnDeleteCancel.addEventListener('click', () => {
            toggleElementDisplay(deleteButtons, 'none');
            showNotification('O post não foi excluído, tá?', 'attention');
          });
        }
      } else {
        showNotification('Nã-nã-não! Você não pode deletar esse post!', 'error');
      }
    }
  };

  listPosts.addEventListener('click', handlePostListClick);



  //EDIT POST: editar comentário feito pelo proprio usuário
  const editPostListClick = (event) => {
    const target = event.target;
    const btnEditPost = target.closest('#btn-edit-post');
    if (btnEditPost) {
      const postId = btnEditPost.getAttribute('data-post-id');
      const uidUser = btnEditPost.getAttribute('data-user-id');
      const postElement = btnEditPost.closest('.post-container');
      const textPostElement = postElement.querySelector('.textPost');
      const originalText = textPostElement.textContent;

      if (uidUser === getUserId()) {
        const toggleElementDisplay = (element, displayValue) => {
          element.style.display = displayValue;
        };

        const editTitle = postElement.querySelector('.edit-title');
        const editArea = postElement.querySelector('.edit-textarea');
        const editButtons = postElement.querySelector('.edit-buttons');
        const btnSave = postElement.querySelector('.btn-edit-save');
        const btnCancel = postElement.querySelector('.btn-edit-cancel');

        if (postElement.classList.contains('editing')) {
          toggleElementDisplay(textPostElement, 'block');
          toggleElementDisplay(editTitle, 'none');
          toggleElementDisplay(editArea, 'none');
          toggleElementDisplay(editButtons, 'none');
          postElement.classList.remove('editing');
        } else {
          editArea.value = originalText;
          toggleElementDisplay(textPostElement, 'none');
          toggleElementDisplay(editTitle, 'block');
          toggleElementDisplay(editArea, 'block');
          toggleElementDisplay(editButtons, 'block');
          postElement.classList.add('editing');
        }

        //botão salvar
        btnSave.addEventListener('click', () => {
          const newText = editArea.value;
          if (newText.trim() !== '') {
            updatePost(postId, { textPost: newText })
              .then(() => {
                textPostElement.textContent = newText;
                toggleElementDisplay(textPostElement, 'block');
                toggleElementDisplay(editTitle, 'none');
                toggleElementDisplay(editArea, 'none');
                toggleElementDisplay(editButtons, 'none');
                postElement.classList.remove('editing');

                showNotification('Eba! Seu post foi editado!', 'success');
              })
              .catch((error) => {
                showNotification('Ops, deu ruim! Erro ao editar o post, tente novamente.', 'error');
                console.error(error);
              });
          } else {
            showNotification('Ai não rola! O post não pode estar vazio.', 'error');
          }
        });

        //botão cancelar
        btnCancel.addEventListener('click', () => {
          toggleElementDisplay(textPostElement, 'block');
          toggleElementDisplay(editTitle, 'none');
          toggleElementDisplay(editArea, 'none');
          toggleElementDisplay(editButtons, 'none');
          postElement.classList.remove('editing');
          showNotification('O post não foi editado, tá?', 'attention');
        });
      } else {
        showNotification('Alto lá! Você não pode alterar esse post!', 'error');
      }
    }
  };

  listPosts.addEventListener('click', editPostListClick);

  // botão função pagina perfil
  btnPerfil.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.hash = '#perfil';
  });

  // botão função de logout
  btnLogout.addEventListener('click', () => {
    userLogout()
      .then(() => {
        window.location.hash = '#login';
      }).catch(() => {
        showNotification('Ops! Erro ao fazer log out. Tente novamente', 'error');
      });
  });

  inicioPosts();

  //Função para abrir area de novo comentário
  const commentNewArea = feedContainer.querySelector('#btn-new-comment-area');
  const newComment = feedContainer.querySelector('#postagens');

  commentNewArea.addEventListener('click', () => {
    console.log('cliquei pra abrir caixa de comentário');
    newComment.classList.toggle('hidden');
    newComment.classList.toggle('visible');
  });

  // function de criação da notificação
  const showNotification = (message, className) => {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;
    notificationElement.classList.add(className);
    notificationElement.style.display = 'block';

    setTimeout(() => {
      notificationElement.style.display = 'none';
      notificationElement.classList.remove(className);
    }, 5000);
  };

  return feedContainer;

};
