import login from './pages/Login/login.js';
import cadastro from './pages/Cadastro/cadastro.js';
import perfil from './pages/Perfil/perfil.js';
import feed from './pages/Feed/feed.js';
import { userAuthCheck } from './lib/authUser.js';
const main = document.querySelector('#root');
const init = async () => {
  window.addEventListener('hashchange', async () => {
    main.innerHTML = '';
    switch (window.location.hash) {
      case '':
      case '#login':
        main.appendChild(login());
        break;
      case '#cadastro':
        main.appendChild(cadastro());
        break;
      case '#perfil':
        main.appendChild(perfil());
        break;
      case '#feed': {
        await verificarLogin();
        break;
      }
      default:
        main.appendChild(login());
        break;
    }
  });
};

/*O código acima cria uma função chamada init que é assíncrona.
Dentro dessa função, é utilizado o seletor querySelector para obter o elemento com o id "root" no 
documento HTML e atribuí-lo à constante main.
Em seguida, é adicionado um evento de escuta através do addEventListener para o evento "hashchange" 
no objeto window. Esse evento é disparado quando a parte da URL que segue o "#" é alterada.
Quando o evento é acionado, a função de retorno de chamada é executada. Essa função limpa o conteúdo 
do elemento main definindo seu innerHTML como uma string vazia. Em seguida, ocorre uma verificação de 
switch-case na propriedade window.location.hash, que retorna a parte da URL que segue o "#".

Existem vários casos possíveis:

Caso a parte da URL seja vazia ou "#login", a função login() é chamada e o seu resultado é anexado ao elemento main usando o método appendChild.
Caso a parte da URL seja "#cadastro", a função cadastro() é chamada e o seu resultado é anexado ao elemento main.
Caso a parte da URL seja "#perfil", a função perfil() é chamada e o seu resultado é anexado ao elemento main.
Caso a parte da URL seja "#feed", a função verificarLogin() é chamada (assumindo que ela seja assíncrona) antes de mais nada e o fluxo é esperado no caminho sequente.
Caso contrário, ou seja, um valor inválido ou desconhecido de window.location.hash, a função login() é chamada e o seu resultado é anexado ao elemento main.
Portanto, esse código está atribuindo um ou mais elementos DOM ao elemento com o id "root" com base na mudança da parte da URL que segue o "#".*/

async function verificarLogin() {
  return userAuthCheck((userLogged) => {
    main.innerHTML = '';
    console.log({ userLogged });
    if (userLogged && userLogged.email) {
      main.appendChild(feed());
    } else {
      window.location.hash = '#login';
      main.appendChild(login());
    }
    init();
  });
}
window.addEventListener('load', async () => {
  verificarLogin();
});

/*O código acima é uma função assíncrona chamada verificarLogin(), que é chamada quando a página é carregada 
(window.addEventListener('load')).
Essa função verifica se o usuário está logado, chamando a função userAuthCheck() que retorna uma Promessa. 
A chamada return userAuthCheck(()) indica que a função verificarLogin() também é uma Promessa e que ela será 
concluída quando a Promessa retornada por userAuthCheck() for resolvida.
Dentro da função userAuthCheck(), quando o usuário está logado (userLogged é verdadeiro e possui um email   
definido), ele limpa o conteúdo do elemento HTML com o id "main" e adiciona um componente de feed. 
Caso contrário, ele redireciona o usuário para a página de login (window.location.hash = '#login') 
e adiciona o componente de login ao elemento HTML com o id "main".
Após a execução dessas ações, a função init() é chamada.
Resumindo, esse código verifica se o usuário está logado e exibe ou o feed da página (caso esteja logado) 
ou a página de login (caso não esteja logado).*/





