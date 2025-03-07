import type { IDespesa } from 'src/interfaces/DespesaInterface';
import { db } from 'src/boot/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { formatarMonetarioBRparaArmazenamento } from 'src/helpers/monetario-helpers';
import { MesesConstant } from 'src/constants/MesesConst';

export const postDespesa = async (despesaModel: IDespesa, uidUsuario: string) => {
  const despesaRef = collection(db, 'users', uidUsuario, 'despesas');

  return await addDoc(despesaRef, despesaModel);
};

export const updateDespesa = async (despesa: IDespesa, uidUsuario: string) => {
  const despesaRef = doc(db, `users/${uidUsuario}/despesas/${despesa.id}`);
  return await setDoc(despesaRef, despesa, { merge: true });
};

export const deleteDespesa = async (uidUsuario: string, uidDespesa: string) => {
  const despesaRef = doc(db, `users/${uidUsuario}/despesas/${uidDespesa}`);
  return await deleteDoc(despesaRef);
};

export const obterTodasDespesasPorIdUsuario = async (uidUsuario: string) => {
  const mesVigente = new Date().getMonth();

  const date = new Date();

  const despesasRef = collection(db, 'users', uidUsuario, 'despesas');

  const q = query(
    despesasRef,
    where('mes_ref', '==', MesesConstant()[mesVigente]),
    where('ano_ref', '==', date.getFullYear()),
  );

  return await getDocs(q);
};

export const filtrarDespesa = async (despesa, uidUsuario: string) => {
  const despesasRef = collection(db, 'users', uidUsuario, 'despesas');

  let q = query(despesasRef);

  const date = new Date();

  const anoBusca = despesa.data !== '' ? Number(despesa.data.split('-')[0]) : date.getFullYear();
  const mesBusca =
    despesa.data !== ''
      ? MesesConstant()[Number(despesa.data.split('-')[1] - 1)]
      : MesesConstant()[new Date().getMonth()];

  // Busca por data deve sempre ocorrer, se não houver filtros para data, filtrará pelo mês/ano vigente;
  q = query(q, where('mes_ref', '==', mesBusca), where('ano_ref', '==', anoBusca));

  if (despesa.descricao) {
    q = query(q, where('descricao', '==', despesa.descricao));
  }

  if (despesa.preco !== 'R$ 0,00') {
    q = query(q, where('preco', '==', formatarMonetarioBRparaArmazenamento(despesa.preco)));
  }

  return await getDocs(q);
};
