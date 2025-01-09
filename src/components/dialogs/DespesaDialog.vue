<template>
  <q-dialog v-model="isOpen">
    <q-card style="max-width: 930px; width: 930px">
      <q-card-section class="row items-center q-pb-none">
        <q-card class="full-width" flat>
          <q-item class="row justify-between">
            <span class="text-h6">Registrar Nova Despesa</span>
          </q-item>
        </q-card>
      </q-card-section>

      <q-card-section>
        <form-despesa :is-required="true">
          <template #botoes>
            <q-item class="row q-gutter-md">
              <q-btn no-caps color="primary" label="Confirmar" />
              <q-btn no-caps color="warning" label="Limpar" @click="null" />
            </q-item>
          </template>
        </form-despesa>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue';
import FormDespesa from '../forms/FormDespesa.vue';

export default defineComponent({
  name: 'DespesaDialogComponent',

  components: {
    FormDespesa,
  },

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
