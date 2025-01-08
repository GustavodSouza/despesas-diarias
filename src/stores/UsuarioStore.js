import { defineStore } from 'pinia';

export const usuarioStore = defineStore('usuarioStore', {
  state: () => ({
    user: {
      uid: null,
      nome: '',
      sobrenome: '',
      email: '',
    },
  }),

  getters: {
    getUsuario() {
      return this.user;
    },
  },

  actions: {
    setUsuario(usuario) {
      this.user.uid = usuario.uid;
      this.user.nome = usuario.nome;
      this.user.sobrenome = usuario.sobrenome;
      this.user.email = usuario.email;
    },

    limparUsuario() {
      this.user = {
        uid: null,
        nome: '',
        sobrenome: '',
        email: '',
      };
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'usuario-store',
        storage: localStorage,
      },
    ],
  },
});
