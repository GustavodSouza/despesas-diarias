import type IUsuario from 'src/interfaces/UsuarioInterface';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from 'src/boot/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const criarContaUsuario = async (usuarioModel: IUsuario) => {
  return await createUserWithEmailAndPassword(auth, usuarioModel.email, usuarioModel.senha);
};

export const realizarLogin = async (usuarioModel: IUsuario) => {
  return await signInWithEmailAndPassword(auth, usuarioModel.email, usuarioModel.senha);
};

export const buscarUsuarioPorUid = async (uidUsuario: string) => {
  const users = collection(db, 'users');
  const q = query(users, where('uid', '==', uidUsuario));

  return await getDocs(q).then((query) => {
    return query;
  });
};

export const atribuirInformacoesPerfilUsuario = async (usuarioModel: IUsuario) => {
  const usersRef = db.collection('users');
  const newDocument = usersRef.doc(usuarioModel.uid);
  return await newDocument.set(usuarioModel);
};
