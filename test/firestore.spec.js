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
    it('traz lista de posts', async () => {
        const lista = await exibAllPosts();
        expect(Array.isArray(lista)).toBe(true);
        expect(lista[0]).toHaveProperty('id');
        expect(lista[1]).toHaveProperty('id');
    });
});



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