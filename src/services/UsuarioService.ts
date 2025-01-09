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
import { usuarioStore } from 'src/stores/UsuarioStore';

export const criarContaUsuario = async (usuarioModel: IUsuario) => {
  return await createUserWithEmailAndPassword(auth, usuarioModel.email, usuarioModel.senha);
};

export const realizarLogin = async (usuarioModel: IUsuario) => {
  return await signInWithEmailAndPassword(auth, usuarioModel.email, usuarioModel.senha);
};

export const realizarLogout = async () => {
  return await signOut(auth);
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

export const realizarLoginGoogle = async () => {
  debugger;
  const provider = new GoogleAuthProvider();
  const usuarioStoreInstance = usuarioStore() as ReturnType<typeof usuarioStore>;

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    usuarioStoreInstance.user.uid = user.uid;
    usuarioStoreInstance.user.nome = 'Teste';
    usuarioStoreInstance.user.sobrenome = 'Teste 2';

    console.log('Usuário logado com Google:', user);

    // Verificar métodos de autenticação existentes
    const methods = await fetchSignInMethodsForEmail(auth, user.email as string);

    if (methods.includes('password')) {
      console.log('Conta já vinculada ao método e-mail/senha.');
    } else {
      console.log('Conta vinculada apenas ao Google.');
    }
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error.message);
  }
};
