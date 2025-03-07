<template>
  <q-item>
    <q-card class="my-card full-width">
      <q-card-section>
        <span class="text-h5 custom-color-primary"
          >Bem-vindo(a)
          <strong v-if="usuarioStoreInstance.user.uid">{{ getNomeCompletoUsuario }}</strong></span
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
