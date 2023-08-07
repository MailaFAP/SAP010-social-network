import './cadastro.css';
import { cadastroUsuarioSenha } from '../../lib/authUser.js';
import { updateProfile } from 'firebase/auth';

import usericon from '../../img/icons/icones-user1.svg';
import emailicon from '../../img/icons/icones-email.svg';
import passwordicon from '../../img/icons/icones-password.svg';
import logo from '../../img/icon_logo_contraplano.png';

export default () => {
  const oldStyles = document.getElementsByTagName("link");
  if (oldStyles.length > 1) oldStyles[1].remove();
  const stylesheet = document.createElement('link');
  stylesheet.setAttribute('rel', 'stylesheet');
  stylesheet.setAttribute('type', 'text/css');
  stylesheet.setAttribute('href', 'pages/Cadastro/cadastro.css');
  document.head.appendChild(stylesheet);

  const cadastroContainer = document.createElement('div');
  const templateCadastro = `<div id="loginBackground"></div><div> 
  <header>
    <picture><img class="logo" src="${logo}"></picture>
  </header>
  <div id="notification" class="notification hidden"></div>
  <div>
    <h2>Bem vinde a sua rede social de filmes</h2>
  </div>
    <form action="">
      <fieldset>
        <legend>Cadastre-se</legend>
        <div class="input-login-cadastro">
          <label for="usuario" id="usuarioLabel" class="inputLabel">
            <p>Usuário</p>
            <br>
            <img class="icons-login-cadastro" src="${usericon}" alt="user Icon">
            <input type="text" class="usuario" id="usuario" placeholder="ex.: Usuário">
          </label>
        </div>
        <div class="input-login-cadastro">
        <label for="email" id="emailLabel" class="inputLabel">
          <p>Email</p>
          <img class="icons-login-cadastro" src="${emailicon}" alt="Email Icon">
          <input type="text" name="email" class="email" id="email" placeholder="ex.: email@email.com">
        </label>
        </div>
        <div class="input-login-cadastro">
          <label for="senha" id="senhaLabel" class="inputLabel">
          <p>Senha</p>
          <img class="icons-login-cadastro" src="${passwordicon}" alt="Password Icon">
          <input type="password" class="senha" id="senha" placeholder="ex.: xxxxxx (min. 6 dígitos)">
          </label>
        </div>
        <button class="btn" id="btn-cad-voltar">Voltar</button>
        <button class="btn" id="btn-cad-concluir">Concluir cadastro</button>
      </fieldset>
    </form>
    <footer>
      <h6>Desenvolvido por: Larissa Velace | Maila Ferreira | Vitória Victor</h6>
      <h6>Bootcamp Laboratoria - Projeto Rede Social - 2023</h6>
    </footer>
  </div>`;

  cadastroContainer.id = 'login'; // CSS
  cadastroContainer.innerHTML = templateCadastro;

  // Informações preenchidas pelo usuário

  const nomeUsuarioEntrada = cadastroContainer.querySelector('#usuario');
  const emailEntrada = cadastroContainer.querySelector('#email');
  const senhaEntrada = cadastroContainer.querySelector('#senha');

  // Botões para cadastrar
  const botaoCadastrar = cadastroContainer.querySelector('#btn-cad-concluir');
  const botaoVoltar = cadastroContainer.querySelector('#btn-cad-voltar');

  // Função Registrar
  const registerUser = (event) => {
    event.preventDefault();
    const usuario = nomeUsuarioEntrada.value;
    const email = emailEntrada.value;
    const senha = senhaEntrada.value;

    // Chamada para a função createUserWithEmail
    cadastroUsuarioSenha(email, senha)
      .then(
        (userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: `${usuario}`,
          })
            .then(() => {
              window.location.hash = '#feed'
            });
        },
      )
      .catch((error) => {
        // Lidar com erros durante o cadastro
        switch (error.code) {
          case 'auth/missing-email':
            showNotification('Ei, tá incompleto aqui! Preencha o e-mail!', 'attention');
            break;

          case 'auth/email-already-in-use':
            showNotification('Epa! O e-mail já está em uso!', 'attention');
            break;

          case 'auth/missing-password':
            showNotification('Ops! Faltou preencher a senha!', 'attention');
            break;

          case 'auth/invalid-password':
            showNotification('Errr... Essa senha é curta ou inválida. Tenta outra!', 'attention');
            break;
          default:
            showNotification('Deu ruim aqui! Dá uma verificada aí, que os dados estão incorretos ou em branco.', 'attention');
        }
      });
  };

  botaoCadastrar.addEventListener('click', registerUser);

  // botão voltar para primeira página
  botaoVoltar.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.hash = '#login';
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

  return cadastroContainer;
};
