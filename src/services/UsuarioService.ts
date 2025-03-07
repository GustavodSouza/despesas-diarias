import type IUsuario from 'src/interfaces/UsuarioInterface';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';

import { db, auth } from 'src/boot/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const criarContaUsuarioService = async (usuarioModel: IUsuario) => {
  return await createUserWithEmailAndPassword(auth, usuarioModel.email, usuarioModel.senha);
};

export const realizarLoginService = async (usuarioModel: IUsuario) => {
  return await signInWithEmailAndPassword(auth, usuarioModel.email, usuarioModel.senha);
};

export const verificarSeUsuarioExisteNaBaseComEmailService = async (usuarioModel: IUsuario) => {
  return await fetchSignInMethodsForEmail(auth, usuarioModel.email);
};

export const realizarLogoutService = async () => {
  return await signOut(auth);
};

export const buscarUsuarioPorUidService = async (uidUsuario: string) => {
  const users = collection(db, 'users');
  const q = query(users, where('uid', '==', uidUsuario));

  return await getDocs(q).then((query) => {
    return query;
  });
};

export const atribuirInformacoesPerfilUsuarioService = async (usuarioModel: IUsuario) => {
  const usersRef = db.collection('users');
  const newDocument = usersRef.doc(usuarioModel.uid);
  return await newDocument.set(usuarioModel);
};

export const realizarLoginGoogleService = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};
