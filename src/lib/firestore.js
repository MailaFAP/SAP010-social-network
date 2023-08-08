import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from './configfirebase.js';

export const posts = async (postagem) => {
  const timestamp = new Date();
  const document = await addDoc(collection(db, 'posts'), {
    nameUser: auth.currentUser.displayName,
    uidUser: auth.currentUser.uid,
    date: timestamp,
    textPost: postagem,
    whoLiked : []
  });
  return document;
};

/*O código acima exporta uma função chamada "posts" que recebe um parâmetro "postagem".
Dentro da função, é criada uma variável "timestamp" que armazena a data e hora atual.
Em seguida, é utilizado o comando "await addDoc(collection(db, 'posts'), { … })" 
para adicionar um novo documento na coleção "posts" do banco de dados.
O novo documento é um objeto que contém diversas propriedades, como "nameUser" 
que representa o nome do usuário atualmente autenticado, "uidUser" 
que representa o ID do usuário autenticado, "date" que armazena o valor da variável "timestamp", "textPost" 
que representa a postagem recebida como parâmetro e "whoLiked" que é um array vazio inicialmente.
Após adicionar o documento, a função retorna o próprio documento.
O uso do "await" no comando "await addDoc()" 
indica que a função assíncrona irá esperar o documento ser adicionado antes de retornar qualquer valor.*/

export const exibAllPosts = async () => {
  const allPosts = [];
  const orderListCollectionPosts = query(collection(db, 'posts'), orderBy('date', 'asc'));
  const trazerPost = await getDocs(orderListCollectionPosts);

  trazerPost.forEach((post) => {
    allPosts.push({ ...post.data(), id: post.id });
  });

  return allPosts;
};

/* Esta função é assíncrona (async) e retorna uma array de objetos.
Dentro da função, são definidas duas variáveis. A primeira é allPosts, que é uma array vazia. 
A segunda é orderListCollectionPosts, que é uma consulta aos documentos da coleção "posts" do banco de dados, 
ordenados por sua propriedade "date" em ordem ascendente.
Em seguida, é utilizado o método getDocs para obter os documentos retornados pela consulta 
orderListCollectionPosts. O resultado dessa consulta é armazenado na variável trazerPost.
Então, é utilizado um loop forEach para iterar sobre cada documento retornado por trazerPost. 
Para cada documento, é criado um novo objeto que é adicionado à array allPosts. 
Esse novo objeto é uma cópia dos dados do documento utilizandoo o operador spread ..., 
com a adição de uma propriedade "id" que é o ID do documento.
Por fim, a função retorna a array allPosts, que contém todos os documentos da coleção "posts" 
ordenados por data ascendente.*/

export const deletePost = async (postId) => {
  const idRefPost = doc(db, 'posts', postId);
  await deleteDoc(idRefPost);
}

/*recebe um parâmetro postId.
Dentro dessa função, a constante idRefPost é criada e recebe uma referência ao documento com o 
ID postId na coleção "posts" do banco de dados.
Em seguida, a função deleteDoc é chamada, passando a referência idRefPost como argumento. 
Essa função é utilizada para deletar o documento especificado no banco de dados.
A palavra-chave await é usada antes da chamada da função deleteDoc para esperar o término da 
operação de deletar o documento antes de continuar com a próxima linha de código. 
Isso é possível porque a função deletePost foi declarada como uma função assíncrona através do uso 
da palavra-chave async.
Portanto, o código acima exporta uma função que deleta um documento específico na coleção "posts" 
do banco de dados.*/

// editar o post
export const updatePost = async (postId, newData) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, newData);
};

/*O código acima exporta uma função chamada "updatePost" que é assíncrona (usando async/await) e recebe 
dois parâmetros: "postId" e "newData".
A função começa obtendo uma referência ao documento com o ID "postId" na coleção "posts" usando a 
função "doc" e os valores "db", "posts" e "postId".
Em seguida, a função aguarda a atualização do documento usando a função "updateDoc", passando a 
referência do documento obtida anteriormente e o objeto "newData".
Resumindo, essa função é responsável por atualizar um documento específico na coleção "posts" 
com novos dados fornecidos.*/

// like e tirar o like
export const likePost = async (postId, userId) => {
  const userHasLikedPost = await hasUserLikedPost(postId, userId);
  const docRef = doc(db, 'posts', postId);
  if (!userHasLikedPost) {
    await updateDoc(docRef, {
      whoLiked: arrayUnion(userId)
    });
    return 'add like';
  } else {
    await updateDoc(docRef, {
      whoLiked: arrayRemove(userId)
    });
    return 'remove like';
  }
};

/*O código acima exporta uma função chamada likePost que recebe dois parâmetros: postId (identificador de um post) 
e userId (identificador de um usuário). Essa função é async, o que significa que ela retorna uma Promise.
Dentro da função, a primeira linha faz uma chamada assíncrona para a função hasUserLikedPost, passando o 
postId e o userId como argumentos. Essa função provavelmente verifica se o usuário já curtiu o post e retorna 
um booleano.
Em seguida, é criada uma referência ao documento do post utilizando o método doc da biblioteca Firestore, 
passando o db (que provavelmente é uma referência à instância do Firestore) e os parâmetros 'posts' (coleção) 
e postId (identificador do documento dentro da coleção) como argumentos.
Depois disso, há um if que verifica se o usuário já curtiu o post. Se userHasLikedPost for falso, significa 
que o usuário ainda não curtiu o post, então executa-se um await para a função updateDoc. Essa função 
provavelmente é responsável por atualizar o documento do post no Firestore. No objeto passado como segundo 
argumento, há uma chave whoLiked que recebe um método arrayUnion passando o userId, indicando que o usuário 
está curtindo o post. Em seguida, é retornado a string 'add like'.
Caso o usuário já tenha curtido o post (ou seja, userHasLikedPost é verdadeiro), executa-se um await para a 
função updateDoc novamente para remover o usuário da lista de curtidas. No objeto passado como segundo argumento, 
há uma chave whoLiked que recebe um método arrayRemove passando o userId, indicando que o usuário não curte mais 
o post. Por fim, é retornado a string 'remove like'.
No geral, esse código implementa uma função assíncrona que permite que um usuário curta um post no Firestore, 
adicionando ou removendo o identificador do usuário na lista de curtidas do post.*/

// id de quem deu like
export const hasUserLikedPost = async (postId, userId) => {
  const docRef = doc(db, 'posts', postId);  
  const docSnap = await getDoc(docRef);
  if (docSnap && docSnap.exists()) {
    const post = docSnap.data();
    const { whoLiked } = post;
    return whoLiked.includes(userId);
  }
  return false;
};
/*O código acima é uma função assíncrona que verifica se um usuário gostou de uma postagem.
A função recebe dois parâmetros: postId (ID da postagem) e userId (ID do usuário).
O código cria uma referência a um documento específico no banco de dados usando o postId. 
Essa referência é criada pela função doc, que recebe como parâmetros o objeto db (instância do banco de dados) 
e os parâmetros collectionPath (nome da coleção) e documentPath (ID do documento).
A função aguarda até que o documento seja recuperado usando a função getDoc, que recebe como parâmetro a 
referência do documento docRef. Essa função retorna uma promessa que resolve em um objeto DocumentSnapshot.
Após recuperar o DocumentSnapshot, o código verifica se o documento existe usando o método exists() do 
DocumentSnapshot. Se o documento existir, ele continua o processamento.
O código recupera os dados do documento usando o método data() do DocumentSnapshot e armazena em uma 
variável chamada post.
Em seguida, é desestruturado o campo whoLiked do objeto post e armazenado em uma variável.
A função verifica se o userId está presente na lista de usuários que gostaram da postagem (whoLiked). 
Isso é feito usando o método includes() do whoLiked.
Se o userId estiver presente na lista de usuários que gostaram da postagem, a função retorna true. 
Caso contrário, retorna false.
Caso o DocumentSnapshot não exista ou o documento não exista, a função retorna false.
O objetivo do código é fornecer uma função que verifica se um usuário deu "like" em uma postagem 
específica no banco de dados.*/