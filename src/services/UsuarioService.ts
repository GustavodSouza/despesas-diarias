import type IUsuario from 'src/interfaces/UsuarioInterface';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  getAuth,
  EmailAuthProvider,
  linkWithCredential,
} from 'firebase/auth';

import { db, auth } from 'src/boot/firebase';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

export const postUsuarioAuthentication = async (usuarioModel: IUsuario) => {
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

export const postUsuario = async (usuario: Partial<IUsuario>) => {
  if (!usuario.uid) {
    throw new Error('UID do usuário é obrigatório.');
  }

  await setDoc(doc(db, 'users', usuario.uid), usuario);
};

export const linkarUsuario = async (usuario: Partial<IUsuario>) => {
  const auth = getAuth();
  const user = auth.currentUser; // Usuário autenticado com o Google

  if (user) {
    const emailCredential = EmailAuthProvider.credential(usuario.email ?? '', usuario.senha ?? ''); // Cria as credenciais de email e senha
    try {
      // Vincula a conta do Google com a conta de email e senha
      await linkWithCredential(user, emailCredential);
      console.log('Contas vinculadas com sucesso!');
    } catch (error) {
      console.error('Erro ao vincular as contas:', error.message);
    }
  } else {
    console.log('Nenhum usuário autenticado com o Google.');
  }
};
