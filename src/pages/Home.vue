<template>
  <q-item>
    <q-card class="my-card full-width">
      <q-card-section v-if="usuarioStoreInstance.user.uid !== ''">
        <span class="text-h5"
          >Bem-vindo(a) <strong>{{ getNomeCompletoUsuario }}</strong></span
        >
        <p>Sistema em fase de construção!</p>
      </q-card-section>
      <q-card-section> </q-card-section>
    </q-card>
  </q-item>
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
