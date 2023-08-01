import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from './configfirebase.js';
import { getAppAuth } from './authUser.js';

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
export const exibAllPosts = async () => {
  const allPosts = [];
  const orderListCollectionPosts = query(collection(db, 'posts'), orderBy('date', 'asc'));
  const trazerPost = await getDocs(orderListCollectionPosts);

  trazerPost.forEach((post) => {
    allPosts.push({ ...post.data(), id: post.id });
  });

  return allPosts;
};

export const deletePost = async (postId) => {
  const idRefPost = doc(db, "posts", postId);
  await deleteDoc(idRefPost);
}

// editar o post
export const updatePost = async (postId, newData) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, newData);
};

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

// id de quem deu like
export const hasUserLikedPost = async (postId) => {
  const docRef = doc(db, 'posts', postId);
  const docSnap = await getDoc(docRef);
  if (docSnap && docSnap.exists) {
    const post = docSnap.data();
    const { whoLiked } = post;
    const currentUser = getAppAuth().currentUser;
    if (currentUser && currentUser.uid) {
      const userId = currentUser.uid;
      return whoLiked.includes(userId);
    }
  }
  return false;
};