import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,  
  auth,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { loginEmail,cadastroUsuarioSenha, loginGoogle, getUserId, userLogout, userAuthCheck, getUserName} from '../src/lib/authUser';
import { app } from '../src/lib/configfirebase';

jest.mock('../src/lib/configfirebase');
jest.mock('firebase/auth');

describe('login', () => {
  it('deverá fazer o login com email e senha correta', async () => {
    const email = 'nome@algo.com';
    const senha = 'jdhjfg5246';
    await loginEmail(email, senha);// verifica a ação do usuário
    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth,email, senha);// verifica o direcionamento esperado
  });
});

/*O código acima descreve um teste de unidade para a função de login.
A função de teste tem uma descrição "login" e contém um caso de teste "deverá fazer o login com email e 
senha correta".
Dentro do caso de teste, duas variáveis ​​"email" e "senha" são declaradas para armazenar um endereço de e-mail e 
senha correta.
Em seguida, a função "loginEmail" é chamada com os parâmetros de email e senha.
Após a chamada da função, são feitas duas asserções para verificar se a função "signInWithEmailAndPassword" 
foi chamada apenas uma vez e se ela foi chamada com os parâmetros corretos: o objeto "auth", o email e a senha.
Essas asserções testam se a ação do usuário de fazer login com email e senha correta direciona corretamente 
para a função de login com email e senha.*/

describe('usuário e senha', () => {
  it('deverá mostrar msg de erro quando email e senha estiverem incorretos', async () => {
    const usuario = 'qualquer'
    const email = 'nome@algo.com';
    const senha = 'jdhjfg5246';
    const dados = {user: usuario};
    createUserWithEmailAndPassword.mockResolvedValue(dados);
    await cadastroUsuarioSenha(email, senha);// verifica a ação do usuário
    expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth ,email, senha);// verifica o direcionamento esperado
  });
});

/*O código acima descreve um teste de unidade que verifica o comportamento de uma função chamada 
cadastroUsuarioSenha.
O teste verifica se a função cadastroUsuarioSenha é chamada corretamente com os parâmetros email e senha. 
Além disso, ele usa as funções mockResolvedValue e toHaveBeenCalledTimes do objeto createUserWithEmailAndPassword 
para criar um valor de retorno fictício e verificar se a função foi chamada apenas uma vez.
No final, o teste também verifica se a função createUserWithEmailAndPassword foi chamada com os argumentos 
esperados auth, email, senha.*/

describe('login com o Google', () => {
  it('deve chamar signInWithPopup com o provedor correto', async () => {    
    const provider = new GoogleAuthProvider();
    const auth = getAuth(); // Importar getAuth do Firebase e inicializar a instância do Auth
    signInWithPopup.mockResolvedValueOnce();    
    await loginGoogle();    
    expect(signInWithPopup).toHaveBeenCalledWith(auth, provider);
  });
});

/*O código acima descreve um teste para a função loginGoogle(), que deve chamar a função signInWithPopup() 
com o provedor GoogleAuthProvider correto.
O teste usa a função describe() do framework de testes para descrever o caso de teste "login com o Google". 
Dentro desse caso de teste, há a função it(), que descreve uma sub-tarefa específica "deve chamar signInWithPopup 
com o provedor correto".
Dentro dessa sub-tarefa, o teste realiza as seguintes ações:
Cria uma instância do provedor GoogleAuthProvider através da linha de código const provider = new 
GoogleAuthProvider();.
Inicializa a instância do Auth do Firebase através da linha de código const auth = getAuth();.
Configura o retorno da função signInWithPopup() para que resolva imediatamente, sem fazer nada, usando a 
função mockResolvedValueOnce().
Chama a função loginGoogle(), que é a função a ser testada.
Por fim, verifica se a função signInWithPopup() foi chamada com os parâmetros auth e provider, 
usando o expect() e toHaveBeenCalledWith(). Isso garante que a função loginGoogle() chamou corretamente 
signInWithPopup() com os parâmetros esperados.*/


describe('getUserId', () => {
  it('should return the current user ID', () => {
    const userId = 'user123';
    const authMock = {
      currentUser: {
        uid: userId,
      },
    };
    getAuth.mockReturnValue(authMock);
    const result = getUserId();
    expect(result).toBe(userId);
  });
});

/*O código acima descreve um teste para a função getUserId. O teste verifica se a função retorna corretamente 
o ID do usuário atual.
Primeiro, é criado um mock da autenticação (authMock) que contém um objeto currentUser com o ID do usuário (uid).
O mock da autenticação é atribuído como retorno da função getAuth, que deve ser uma função jest/mock.
Em seguida, a função getUserId é chamada e o seu resultado é armazenado na variável result.
Por fim, é feito um teste para verificar se o resultado da função getUserId é igual ao valor do ID do usuário 
(userId).*/

describe('getUserName', () => {
  it('deve retornar o nome de usuário se o usuário for autenticado', () => {
    const displayName = 'Testando';
    const authMock = {
      currentUser: {
        displayName,
      },
    };
    getAuth.mockReturnValue(authMock);

    const result = getUserName();

    expect(result).toBe(displayName);
  });

  it('deve retornar "Anônimo" se o usuário não estiver autenticado ou não tiver displayName', () => {
    const authMock = {
      currentUser: {}, // Defina currentUser sem displayName ou como undefined
    };
    getAuth.mockReturnValue(authMock);

    const result = getUserName();

    expect(result).toBe("Anônimo");
  });
});

/*O código acima descreve duas descrições de testes para a função getUserName.
A primeira descrição testa se a função retorna o nome do usuário quando o usuário está autenticado.
Nesse caso, é criada uma variável displayName com o valor 'Testando'. Em seguida, é criado um objeto authMock 
simulando um objeto de autenticação do usuário com a propriedade currentUser, que contém o displayName.
A função getAuth é mockada com a função mockReturnValue, retornando o objeto authMock.
A função getUserName é chamada e seu resultado é armazenado na variável result.
Por fim, é feita uma asserção com o expect para verificar se o resultado da função getUserName é igual à 
variável displayName.
A segunda descrição de teste testa se a função retorna "Anônimo" quando o usuário não está autenticado ou 
não tem um displayName.
Nesse caso, o objeto authMock é definido sem a propriedade displayName ou como undefined.
A função getAuth é mockada novamente com a função mockReturnValue, retornando o objeto authMock.
A função getUserName é chamada e o resultado é armazenado na variável result.
Por fim, é feita uma asserção com o expect para verificar se o resultado da função getUserName é igual 
a "Anônimo".*/



describe('userLogout', () => {
  it('deve fazer logout do usuário', () => {
    const authMock = getAuth();
    signOut.mockResolvedValueOnce({
      user: {},
    });
    userLogout();
    expect(signOut).toHaveBeenCalledWith(authMock);
  });
});

describe('userAuthCheck', () => {
  it('chama onAuthStateChanged com authLogin e callback', () => {
    const authLogin = jest.fn();
    const callback = jest.fn();
    getAuth.mockReturnValue(authLogin);
    userAuthCheck(callback);
    expect(getAuth).toHaveBeenCalledWith(app);
    expect(onAuthStateChanged).toHaveBeenCalledWith(authLogin, callback);
  });
});
/*O código acima são dois testes de funções relacionadas à autenticação de usuário.
No primeiro teste, a função userLogout é testada. Ela chama a função signOut (que é uma função assíncrona 
  de logout de usuário) e espera que ela seja chamada com o objeto authMock. O objetivo desse teste é verificar 
  se a função userLogout está chamando corretamente a função signOut com o parâmetro certo.
No segundo teste, a função userAuthCheck é testada. Ela chama as funções getAuth e onAuthStateChanged. 
O teste espera que a função getAuth seja chamada com o objeto app como parâmetro e que a função onAuthStateChanged 
seja chamada com os objetos authLogin e callback como parâmetros. O objetivo desse teste é verificar se as 
funções getAuth e onAuthStateChanged estão sendo chamadas corretamente com os parâmetros corretos.*/


