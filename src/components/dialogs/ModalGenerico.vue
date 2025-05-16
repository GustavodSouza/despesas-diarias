<template>
  <q-dialog v-model="isOpen">
    <q-card style="max-width: 930px">
      <q-card-section class="column q-pb-none">
        <q-item class="row">
          <slot name="titulo" />
        </q-item>
        <q-item class="row">
          <slot name="conteudo" />
        </q-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { defineComponent, shallowRef } from 'vue';

export default defineComponent({
  name: 'ModalGenericoComponent',

  props: {
    tamanhoModal: {
      type: String,
      required: false,
      default: '.md',
    },
  },

  components: {},

  data() {
    return {
      isOpen: shallowRef<boolean>(false),
    };
  },

  methods: {
    openModal() {
      this.toogleModal(true);
    },

    toogleModal(valor: boolean): void {
      this.isOpen = valor;
    },
  },
});
</script>
