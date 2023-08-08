import { addDoc, collection, deleteDoc, updateDoc, query, orderBy, getDocs, getDoc } from 'firebase/firestore';
import { posts, deletePost, updatePost, exibAllPosts, hasUserLikedPost, likePost } from '../src/lib/firestore';
import { auth, db } from '../src/lib/configfirebase';

const idRefPost = { id: '123' };
const newData = { title: 'Novo Título', content: 'Novo conteúdo' };


jest.mock('firebase/firestore', () => ({
    addDoc: jest.fn(),
    deleteDoc: jest.fn(),
    updateDoc: jest.fn(),
    arrayUnion: jest.fn(),
    arrayRemove: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(() => idRefPost),
    query: jest.fn(),
    orderBy: jest.fn(),
    getDoc: jest.fn(),  
    getDocs: jest.fn().mockResolvedValue(new Array(
        {
            data: () => {
                return {
                    date: '28 de julho de 2023 às 06:50:07 UTC-3',
                    nameUser: 'Feijoada',
                    textPost: 'Vendo filmes de comida enquanto como, claro.',
                    uidUser: '2PU3fWBYiVNYPi2k2vYC4VAvii52',
                    whoLiked: ['',
                        'W9zoHQt18ZYwMPGJisVtiHqFAcS2',
                        'jCJ7pDW6KYUQQ9kYafmxhBGjHiu2',
                        'AS3UFBGJG4eSqPxzqiQ4qO4CKSK2'
                    ]
                };
            },
            id: 55485488
        },
        {
            data: () => {
                return {
                    date: '28 de julho de 2023 às 06:50:07 UTC-3',
                    nameUser: 'Feijoada',
                    textPost: 'Vendo filmes de comida enquanto como, claro.',
                    uidUser: '2PU3fWBYiVNYPi2k2vYC4VAvii52',
                    whoLiked: ['',
                        'W9zoHQt18ZYwMPGJisVtiHqFAcS2',
                        'jCJ7pDW6KYUQQ9kYafmxhBGjHiu2',
                        'AS3UFBGJG4eSqPxzqiQ4qO4CKSK2'
                    ]
                };
            },
            id: 988744848
        }))
}));

jest.mock('../src/lib/configfirebase', () => ({
    auth: jest.fn(),
    db: jest.fn()
}));

describe('posts', () => {
    it('adiciona o comentário ao usuário com data/hora', async () => {
        const currentUser = {
            displayName: 'John Doe',
            uid: '123456789'
        };
        const timestamp = new Date('2022-01-01T00:00:00');
        auth.currentUser = currentUser;
        jest.spyOn(global, 'Date').mockImplementation(() => timestamp);
        const postagem = 'Hello, world!';
        const expectedDocument = {
            nameUser: currentUser.displayName,
            uidUser: currentUser.uid,
            date: timestamp,
            textPost: postagem,
            whoLiked: []
        };
        await posts(postagem);
        expect(collection).toHaveBeenCalledWith(db, 'posts');
        expect(addDoc).toHaveBeenCalledWith(collection(), expectedDocument);

    });
});

/*O código acima descreve um teste de unidade para a função "adiciona o comentário ao usuário com data/hora" no módulo "posts".

Primeiro, é criado um objeto "currentUser" que representa o usuário atual com as propriedades "displayName" e "uid".
Em seguida, uma variável "timestamp" é criada com uma data específica.
A propriedade "currentUser" do objeto "auth" é atualizada com o valor do objeto "currentUser".
A função "mockImplementation" do objeto global "Date" é chamada para substituir a implementação padrão do construtor "Date" e retornar sempre o valor da variável "timestamp".
É criada uma constante "postagem" com o valor "Hello, world!".
É criado um objeto "expectedDocument" com as propriedades: "nameUser" (nome do usuário), "uidUser" (UID do usuário), "date" (data/hora), "textPost" (texto da postagem) e "whoLiked" (quem curtiu a postagem, inicialmente vazio).
A função "posts" é chamada com o parâmetro "postagem" e é esperado que seja executada de forma assíncrona.
É verificado se a função "collection" foi chamada com os argumentos "db" e "posts".
É verificado se a função "addDoc" foi chamada com os argumentos retornados da função "collection" e "expectedDocument".*/

describe('deletePost', () => {
    it('deleta a postagem feita por um id identificado', async () => {
        const postId = '123';
        await deletePost(postId);
        expect(deleteDoc).toHaveBeenCalledWith(idRefPost);
    });
});

/*O código acima descreve um teste para a função deletePost.
A função describe é usada para descrever o conjunto de testes relacionados à função deletePost. 
No caso, o conjunto de testes é chamado "deletePost".
A função it é usada para descrever um cenário específico de teste. No caso, o cenário é "deleta a 
postagem feita por um id identificado".
Em seguida, é definida uma variável postId com o valor "123", que representa o ID da postagem a ser deletada.
Em seguida, é chamada a função deletePost passando o postId como argumento. Essa função deve deletar a 
postagem com o ID fornecido.
Por fim, é usada a função expect para verificar se a função deleteDoc foi chamada com o argumento idRefPost. 
Ou seja, o teste verifica se a função deletePost está chamando corretamente a função deleteDoc com o ID da 
postagem a ser deletada.*/


describe('updatePost', () => {
    it('atualiza com o nova postagem do id identificado', async () => {
        const postId = 'post123';
        await updatePost(postId, newData);
        expect(updateDoc).toHaveBeenCalledWith(idRefPost, newData);
    });
});

/*O código acima descreve um teste para a função updatePost. Dentro deste teste, há o uso da função it que 
descreve o que o teste deve fazer.
O teste em si tem como objetivo verificar se a função updatePost atualiza uma postagem com os novos 
dados fornecidos. Para isso, é declarada a constante postId que recebe o valor "post123". Em seguida, 
é chamada a função updatePost passando o postId e newData como parâmetros.
Após a chamada da função, utiliza-se o expect para verificar se a função updateDoc foi chamada com o 
argumento idRefPost (referência ao ID da postagem) e newData (novos dados da postagem). 
A função toHaveBeenCalledWith verifica se a função foi chamada com os argumentos corretos.*/


describe('exibAllPosts', () => {
    it('traz lista de posts', async () => {
        const lista = await exibAllPosts();
        expect(Array.isArray(lista)).toBe(true);
        expect(lista[0]).toHaveProperty('id');
        expect(lista[1]).toHaveProperty('id');
    });
});

/*O código acima descreve um teste para a função exibAllPosts. O teste verifica se a função retorna 
uma lista de posts e se cada post possui a propriedade id.
A função describe é usada para agrupar os testes relacionados a uma determinada funcionalidade. 
Neste caso, o grupo de testes é chamado de 'exibAllPosts'.
A função it é usada para descrever um teste específico dentro do grupo 'exibAllPosts'. Neste caso, 
o teste é chamado de 'traz lista de posts'.
Dentro do teste, a constante 'lista' é atribuída ao resultado da chamada da função exibAllPosts, 
que deve retornar uma lista de posts.
O teste verifica se a 'lista' é um array, usando a função Array.isArray(lista). Se for verdadeiro, 
significa que é uma lista de posts.
Em seguida, o teste verifica se o primeiro e o segundo elemento da 'lista' possuem a propriedade 'id', 
usando as funções expect(...).toHaveProperty('id').*/


describe('likePost', () => {    
    it('dar like', async () => {
        const legumes = await likePost('abobrinha', 'chuchu');
        expect(legumes).toBe('add like');

    });
    it('remove like', async () => {
        getDoc.mockResolvedValueOnce({
            exists: () => true,
            id: 55485488,
            data: () => {
                return {whoLiked: ['id do usuário']};
            }
        });        
        const maisLegumes = await likePost(55485488, 'id do usuário');
        expect(maisLegumes).toBe('remove like');

    });
});
/*O código acima é um teste unitário para a função likePost.
A função describe é usada para agrupar os casos de teste relacionados à função likePost.
Dentro do describe, temos duas chamadas de it, que são os casos de teste individuais.
O primeiro caso de teste verifica se a função likePost adiciona um like corretamente. 
Ele chama a função likePost com os parâmetros 'abobrinha' e 'chuchu' e espera que o valor retornado 
seja 'add like'.
O segundo caso de teste verifica se a função likePost remove um like corretamente. 
Ele substitui a implementação da função getDoc com uma versão que sempre retorna um valor específico. 
A função getDoc é usada para obter os detalhes de um documento do banco de dados, e nesse caso está 
sendo usada para simular que o documento existe e que já possui um like do usuário. Em seguida, 
o caso de teste chama a função likePost com os parâmetros 55485488 e 'id do usuário' e espera que o 
valor retornado seja 'remove like'.
Em resumo, esses casos de teste testam se a função likePost está adicionando e removendo likes 
corretamente, verificando os valores de retorno da função.*/


describe('hasUserLikedPost', () => {  
    it('usuário deu like', async () => {
        getDoc.mockResolvedValueOnce({
            exists: () => true,
            data: () => {
                return {whoLiked: ['id do usuário']};
            }
        });
        const like = await hasUserLikedPost('id do post', 'id do usuário');
        expect(like).toBeTruthy();
    });

    it('usuário não deu like', async () => {
        getDoc.mockResolvedValueOnce({exists: () => false});
        const like = await hasUserLikedPost('id do post', 'id do usuário');
        expect(like).toBeFalsy();
    });
});

/*O código acima descreve dois casos de teste para a função hasUserLikedPost.
No primeiro caso de teste, é simulado que o documento referencia pelo getDoc já existe (exists: () => true) e 
possui o campo whoLiked contendo um array com o ID do usuário que deu like no post.
No segundo caso de teste, é simulado que o documento não existe (exists: () => false).
Em ambos os casos, a função hasUserLikedPost é chamada com o ID do post e o ID do usuário e 
espera-se que retorne true no primeiro caso (usuário deu like) e false no segundo caso (usuário não deu like).
Os testes utilizam o expect para fazer as asserções sobre o retorno da função e garantir que o comportamento 
está correto.*/
