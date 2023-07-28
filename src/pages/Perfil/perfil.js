import './perfil.css';
import { userLogout, getUserName } from '../../lib/authUser.js';

import logocontraplano from '../../img/icon_logo_contraplano.png';
import feedicon from '../../img/icons/icones-feed.svg';
//import commentarea from '../../img/icons/icones-comment.svg';
//import newposticon from '../../img/icons/icones-send.svg';
import logouticon from '../../img/icons/icones-logout.svg';


export default () => {
  const stylesheet = document.createElement('link');
  stylesheet.setAttribute('rel', 'stylesheet');
  stylesheet.setAttribute('type', 'text/css');
  stylesheet.setAttribute('href','pages/Perfil/perfil.css');
  document.head.appendChild(stylesheet);

  const perfilContainer = document.createElement('div');
  const templatePerfil = `
  <header class="headerperfil">
      <picture><img class="logoperfil" src="${logocontraplano}"></picture>
      <div>
        <h3> Perfil </h3>
        <p>${getUserName()}</p>
      </div>
  <section>
  <div id="notification" class="notification hidden"></div>
    <button class="btn-feed" id="btn-feed"><img class="icon" title="Feed" src="${feedicon}"></button>
    <button class="btn-logout" id="btn-logout"><img class="icon" title="Log Out" src="${logouticon}"></button>
  </section>
  </header>
  <section class = inicioPerfil>
      <h4> ”É curioso como as cores do mundo real parecem muito mais reais quando vistas no cinema.” Laranja Mêcanica, 1971 </h4>
  </section>
  <section>

  </section>
  <footer>
    <h6>Desenvolvido por: Larissa Velace | Maila Ferreira | Vitória Victor</h6>
    <h6>Bootcamp Laboratoria - Projeto Rede Social - 2023</h6>
  </footer>
  </div>`;

  perfilContainer.innerHTML = templatePerfil;

  const btnFeed = perfilContainer.querySelector('#btn-feed');
  const btnLogout = perfilContainer.querySelector('#btn-logout');

      // botão função pagina feed
      btnFeed.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = '#feed';
      });

    // botão função de logout
    btnLogout.addEventListener('click', () => {
      userLogout()
        .then(() => {
          window.location.hash = '#login';
        }).catch(() => {
          alert('Ocorreu um erro, tente novamente.');
        });
    });

  return perfilContainer;
};