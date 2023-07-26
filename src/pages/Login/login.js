import './login.css';
import { loginEmail, loginGoogle } from "../../lib/authUser.js";

import googleicon from '../../img/icons/icones-google.svg';
import emailicon from '../../img/icons/icones-email.svg';
import passwordicon from '../../img/icons/icones-password.svg';

export default () => {
  const oldStyles = document.getElementsByTagName("link");
  if(oldStyles.length > 1) oldStyles[1].remove();
  const stylesheet = document.createElement('link');
  stylesheet.setAttribute('rel', 'stylesheet');
  stylesheet.setAttribute('type', 'text/css');
  stylesheet.setAttribute('href','pages/Login/login.css');
  document.head.appendChild(stylesheet); 

  const loginContainer = document.createElement('div');
  const templateLogin = `<div id="loginBackground"></div>
  <div>
  <header>
    <picture><img class="logo" src="./img/logo_contraplano.png"></picture>
</header>
<div>
  <h2>Bem vinde a sua rede social de filmes</h2>
  <p>Login</p>
</div>
<div>
<fieldset>
  <div class="input-login-cadastro">
    <label for="email" id="emailLabel" class="inputLabel">
      <p>E-mail</p>
      <img class="icons-login-cadastro" src="${emailicon}" alt="Email Icon">
      <input type="text" name="email" class="email" id="email" placeholder="ex.: email@email.com">
    </label>
  </div>
  <div class="input-login-cadastro">
    <label for="senha" id="senhaLabel" class="inputLabel">
    <p>Senha</p>
    <img class="icons-login-cadastro" src="${passwordicon}" alt="Password Icon">
    <input type="password" name="senha" class="senha" id="senha" placeholder="ex.: xxxxxx (min. 6 dígitos)">
    </label>
  </div>
  <button class="btn" id="btn-login-entrar">Entrar</button>
  <div id="errorMessage"></div>
  <br>
  <label for="loginGoogle" id="loginGoogle" class="loginGoogle"></label>
  <button class="btn btn-transparente" id="btn-login-google">Login com<img alt='google icon' class='icon' src="${googleicon}"></button>
  <br>
  <button class="btn btn-escuro" id="btn-login-criar-conta">Não tem login? Crie sua conta agora</button>
</fieldset>
</div>
<footer>
<h5>Bootcamp Laboratoria - Projeto Rede Social</h5>
<h6>Desenvolvido por Larissa, Maila e Vitória</h6>
<p>2023</p>
</footer></div>`;

  loginContainer.id = 'login';
  loginContainer.innerHTML = templateLogin;

  // Informações preenchidas pelo usuário
  const emailEntrada = loginContainer.querySelector('#email');
  const senhaEntrada = loginContainer.querySelector('#senha');
  const errorMessage = loginContainer.querySelector('#errorMessage');

  // Botões
  const entrarLoginBotao = loginContainer.querySelector('#btn-login-entrar');
  const criarLoginBotao = loginContainer.querySelector('#btn-login-criar-conta');
  const criarLoginGoogleBotao = loginContainer.querySelector('#btn-login-google');

  // Função de login
  const firstLogin = (event) => {
    event.preventDefault();
    const email = emailEntrada.value;
    const senha = senhaEntrada.value;
    // Chamada para a função de login
    loginEmail(email, senha)

      .then(() => {
        window.location.hash = '#feed';
      })
      .catch(() => {
        errorMessage.textContent = 'Informações de e-mail ou senha incorretas. Tente novamente';
        errorMessage.style.display = 'block';
      });
    return false;
  };

  entrarLoginBotao.addEventListener('click', firstLogin);

  //evento para ouvir quando a mensagem estiver começando a ser digitada e limpar campo de erro
    emailEntrada.addEventListener('input', () => {
      errorMessage.textContent = '';
    });
    senhaEntrada.addEventListener('input', () => {
      errorMessage.textContent = '';
    });

  // Login Google
  criarLoginGoogleBotao.addEventListener('click', () => {
    loginGoogle()
      .then(() => {
        window.location.hash = '#feed';
      }).catch(() => {
        errorMessage.textContent = 'Não foi possível logar com o Google';
        errorMessage.style.display = 'block';
      });
  });

  criarLoginBotao.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.hash = '#cadastro';
  });

  return loginContainer;
};
