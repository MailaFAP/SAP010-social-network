import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
//onSnapshot colocar import
import { auth, db } from './configfirebase.js';


export const posts = async (postagem) => {
  const timestamp = new Date().getTime();
  const realPost = {
    nameUser: auth.currentUser.displayName,
    uidUser: auth.currentUser.uid,
    date: timestamp,
    textPost: postagem,
    like: []
  };
  const document = await addDoc(collection(db, 'posts'), realPost);
  realPost.id = document.id;
  return realPost;
};

export const exibAllPosts = async () => {
  const allPosts = [];
  const orderListCollectionPosts = query(collection(db, 'posts'), orderBy('date', 'desc'));
  const trazerPost = await getDocs(orderListCollectionPosts);

  trazerPost.forEach((post) => {
    allPosts.push({ ...post.data(), id: post.id });
  });

  return allPosts;
};

export const deletePost = async (postId) => {
  const idRefPost = doc(db, "posts", postId);
  await deleteDoc(idRefPost);
};



/* export const exibAllPosts = (updateListPosts) => {
  const allPosts = [];
  const orderListCollectionPosts = query(collection(db, 'posts'), orderBy('date', 'desc'));

  onSnapshot(orderListCollectionPosts, (querySnapshot) => {
    allPosts.length = 0;
    querySnapshot.forEach((post) => {
      allPosts.push({ ...post.data(), id: post.id });
    });
    updateListPosts(allPosts);
  })

}; */