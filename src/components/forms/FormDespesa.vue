<template>
  <q-form class="row">
    <q-item class="column col-md-4 col-sm-12 col-xs-12">
      <label class="text-bold" for="descricao">Descrição</label>
      <q-input
        id="descricao"
        class="full-width"
        v-model="form.descricao"
        stack-label
        outlined
        counter
        placeholder="Insira a descrição da despesa"
        @update:model-value="emitDescricao"
      />
    </q-item>
    <q-item class="column col-md-4 col-sm-12 col-xs-12">
      <label class="text-bold" for="data">Data da Despesa</label>
      <q-input
        id="data"
        class="full-width"
        v-model="form.data"
        type="date"
        outlined
        @update:model-value="emitData"
      />
    </q-item>
    <q-item class="column col-md-4 col-sm-12 col-xs-12">
      <label class="text-bold" for="preco">Preço da Despesa</label>
      <q-input
        id="preco"
        class="full-width"
        v-model="form.preco"
        placeholder="Insira o preço pago pela despesa"
        outlined
        v-money="money"
        @update:model-value="emitPreco"
      />
    </q-item>

    <!-- Inserção de botões -->
    <slot name="botoes"></slot>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue';
import { VMoney } from 'v-money';

export default defineComponent({
  name: 'FormDespesaComponent',

  emits: ['emitDescricao', 'emitData', 'emitPreco'],

  directives: { money: VMoney },

  props: {
    isRequired: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2,
        masked: false,
      },
      form: {
        descricao: shallowRef<string>(''),
        data: shallowRef<string>(''),
        preco: shallowRef<string>(''),
      },
    };
  },

  methods: {
    emitDescricao(descricao: string): void {
      this.$emit('emitDescricao', descricao);
    },

    emitData(data: string): void {
      this.$emit('emitData', data);
    },

    emitPreco(preco: string): void {
      this.$emit('emitPreco', preco);
    },
  },
});
</script>
