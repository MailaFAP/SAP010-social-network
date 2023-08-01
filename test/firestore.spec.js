import { addDoc, collection, deleteDoc, updateDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { posts, deletePost, updatePost, exibAllPosts } from '../src/lib/firestore';
import { auth, db } from '../src/lib/configfirebase';

const idRefPost = { id: '123' };
const newData = { title: 'Novo Título', content: 'Novo conteúdo' };

jest.mock('firebase/firestore', () => ({
    addDoc: jest.fn(),
    deleteDoc: jest.fn(),
    updateDoc: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(() => idRefPost),
    query: jest.fn(),
    orderby: jest.fn(),
    getDocs: jest.fn()
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
            like: []
        };
        await posts(postagem);
        expect(collection).toHaveBeenCalledWith(db, 'posts');
        expect(addDoc).toHaveBeenCalledWith(collection(), expectedDocument);

    });
});

describe('deletePost', () => {
    it('deleta a postagem feita por um id identificado', async () => {
        const postId = '123';
        await deletePost(postId);
        expect(deleteDoc).toHaveBeenCalledWith(idRefPost);
    });
});


describe('updatePost', () => {
    it('atualiza com o nova postagem do id identificado', async () => {
        const postId = 'post123';
        await updatePost(postId, newData);
        expect(updateDoc).toHaveBeenCalledWith(idRefPost, newData);
    });
});


describe('exibAllPosts', () => {
    it('deve retornar uma lista vazia quando não houver posts', async () => {
        // mockando a função getDocs para retornar uma lista vazia
        const getDocs = jest.fn().mockResolvedValue([]);
        // chamando a função a ser testada
        const result = await exibAllPosts();
        // verificando se a lista retornada é vazia
        expect(result).toEqual([]);
        // verificando se a função getDocs foi chamada corretamente
        expect(getDocs).toHaveBeenCalledWith(query(collection(db, 'posts'), orderBy('date', 'asc')));
    });

    it('deve retornar a lista de posts corretamente', async () => {
        // criando um array para simular os dados dos posts
        const posts = [
            { id: 1, title: 'Post 1', date: '2022-01-01' },
            { id: 2, title: 'Post 2', date: '2022-01-02' },
            { id: 3, title: 'Post 3', date: '2022-01-03' }
        ];
        // mockando a função getDocs para retornar os posts criados
        const getDocs = jest.fn().mockResolvedValue(posts);
        // chamando a função a ser testada
        const result = await exibAllPosts();
        // verificando se a lista retornada é igual aos posts criados com o id adicionado
        expect(result).toEqual([
            { id: 1, title: 'Post 1', date: '2022-01-01' },
            { id: 2, title: 'Post 2', date: '2022-01-02' },
            { id: 3, title: 'Post 3', date: '2022-01-03' }
        ]);
        // verificando se a função getDocs foi chamada corretamente
        expect(getDocs).toHaveBeenCalledWith(query(collection(db, 'posts'), orderBy('date', 'asc')));
    });
});