<template>
  <div>
    <span> Home </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { usuarioStore } from 'src/stores/UsuarioStore';

export default defineComponent({
  name: 'HomeComponent',

  data() {
    const usuarioStoreInstance = usuarioStore();

    return {
      usuarioStoreInstance,
    };
  },

  computed: {
    getNomeCompletoUsuario(): string {
      return `${this.usuarioStoreInstance.getUsuario.nome} ${this.usuarioStoreInstance.getUsuario.sobrenome}`;
    },
  },
});
</script>
