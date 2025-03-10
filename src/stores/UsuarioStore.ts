import { defineStore } from 'pinia';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const usuarioStore = defineStore('usuarioStore', {
  state: () => ({
    user: {
      uid: '',
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

    reset() {
      this.$reset();
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
