import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut,
  onAuthStateChanged } from 'firebase/auth';
import { app } from './configfirebase.js';

//Autenticação
export const getAppAuth = () => getAuth(app);
/* Essa função não recebe nenhum argumento e retorna uma chamada para a função "getAuth" com a variável "app" 
como argumento.
"app" vem do firebase. A função "getAuth" é uma função que recebe um objeto e retorna 
autenticação do aplicativo .*/

// Criar Usuário
export function cadastroUsuarioSenha(email, senha) {
  const auth = getAppAuth();
  return createUserWithEmailAndPassword(auth, email, senha);    
}
/* Essa função recebe dois parâmetros: "email" e "senha".
Dentro dessa função, há duas chamadas de função. A primeira é a função "getAppAuth()", que retorna um 
objeto chamado "auth" utilizado para realizar autenticação no aplicativo. A segunda chamada de função é 
"createUserWithEmailAndPassword()", que é responsável por criar um usuário com email e senha no aplicativo.
O retorno da função "createUserWithEmailAndPassword()" é retornado pela função "cadastroUsuarioSenha", 
ou seja, essa função retorna uma Promise contendo a criação de um usuário com o email e senha passados como 
parâmetros.*/

// Login
export function loginEmail(email, senha) {
  const auth = getAppAuth();
  return signInWithEmailAndPassword(auth, email, senha);
}

/*recebe dois parâmetros: email e senha. 
Dentro da função, é chamada outra função chamada "getAppAuth()" que retorna uma instância de autenticação 
do aplicativo. Em seguida, é chamada a função "signInWithEmailAndPassword()" passando a instância de autenticação, 
o email e a senha como argumentos. Essa função é responsável por realizar o login do usuário utilizando o 
email e senha informados. A função "loginEmail()" retorna o resultado da função "signInWithEmailAndPassword()".*/

// login google
export const loginGoogle = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAppAuth();
  return signInWithPopup(auth, provider);
};

/* realiza o login usando o Google como provedor de autenticação.
Dentro da função, são criados uma instância do provedor de autenticação do Google GoogleAuthProvider() 
e uma instância de autenticação do aplicativo getAppAuth().
Por fim, é feito o login usando uma janela pop-up, utilizando a função signInWithPopup() passando a 
instância de autenticação e o provedor de autenticação do Google como parâmetros.
Essa função retorna uma promessa (promise) que é resolvida quando o usuário efetua o login com sucesso 
ou rejeitada caso ocorra algum erro.*/

// deslogar
export function userLogout() {
  const authLogOut = getAuth();
  return signOut(authLogOut);
}
/*O código acima é uma função chamada "userLogout" exportada para ser usada em outros módulos.
Dentro da função, uma constante chamada "authLogOut" é criada e recebe a função "getAuth()", 
que provavelmente é uma função para obter a autenticação do usuário.
Em seguida, a função "signOut" é chamada, passando a constante "authLogOut" como argumento. 
Essa função "signOut" provavelmente é responsável por fazer o logout do usuário, encerrando a 
sessão de autenticação.
Portanto, o objetivo do código é fazer o logout do usuário através da chamada da função "signOut" 
com a autenticação obtida por meio da função "getAuth()".*/

//verifica se esta logado
export function userAuthCheck(callback) {
  const authLogin = getAuth(app);
  return onAuthStateChanged(authLogin, callback);
}

/*A função recebe um callback como parâmetro.
Dentro da função, é criada uma constante authLogin que recebe o valor retornado pela função getAuth(app). 
Essa função getAuth é responsável por obter o objeto de autenticação do Firebase. O parâmetro app pode ser 
uma instância do aplicativo Firebase ou nulo. Através desse objeto de autenticação, é possível gerenciar a 
autenticação do usuário.
Em seguida, é feito o retorno da função onAuthStateChanged, passando como parâmetros o objeto de autenticação 
authLogin e o callback recebido como parâmetro da função userAuthCheck. A função onAuthStateChanged é um 
observador de eventos que é acionado sempre que o estado de autenticação do usuário é alterado. Esse observador 
recebe como parâmetros o objeto de autenticação e uma função de callback para ser executada quando o estado de 
autenticação é alterado.
Sendo assim, o objetivo dessa função userAuthCheck é criar um observador para o estado de autenticação do 
usuário no Firebase e executar o callback recebido sempre que o estado de autenticação for alterado.*/

// retorno do usuario autenticado
export const getUserName = () => {
  const auth = getAppAuth();
  const user = auth.currentUser;
  if (user.displayName) {
    return user.displayName;
    //return user.photoURL;
  }
  return "Anônimo";
};

/* retorna o nome do usuário atualmente autenticado no aplicativo.
A função começa obtendo as informações de autenticação do aplicativo através da chamada da função 
getAppAuth(). A partir dessas informações, o usuário atual é acessado através da propriedade currentUser.
Em seguida, o código verifica se o usuário possui um displayName (nome de exibição) definido. Se houver, 
o nome de exibição é retornado pela função. Caso contrário, a função retorna a string "Anônimo".*/

// id do usuario no firebase
export const getUserId = () => {
  const auth = getAppAuth();
  return auth.currentUser.uid;
};
/*retorna o ID do usuário atual.
A função começa obtendo a autenticação da aplicação, chamando a função getAppAuth(). 
Em seguida, a função currentUser é chamada na instância de autenticação para obter o objeto do usuário atual. 
O ID do usuário é então retornado usando a propriedade uid.*/