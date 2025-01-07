<template>
  <q-layout view="hHh Lpr lff" style="height: 100vh; width: 100vw">
    <q-page-container>
      <span class="text-h6"
        >Bem-vindo(a) <strong>{{ getNomeCompletoUsuario }}</strong></span
      >
    </q-page-container>
  </q-layout>
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
