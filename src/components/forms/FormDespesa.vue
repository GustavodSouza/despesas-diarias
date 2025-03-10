<template>
  <q-form ref="formulario" class="row">
    <q-item class="column col-md-4 col-sm-12 col-xs-12">
      <label class="text-bold custom-color-tertiary" for="descricao">Descrição</label>
      <q-input
        id="descricao"
        class="full-width"
        v-model="form.descricao"
        stack-label
        outlined
        counter
        placeholder="Insira a descrição da despesa"
        @update:model-value="emitDescricao"
        :rules="isRequired ? [validarCampo] : []"
      />
    </q-item>
    <q-item class="column col-md-4 col-sm-12 col-xs-12">
      <label class="text-bold custom-color-tertiary" for="data">Data da Despesa</label>
      <q-input
        v-if="isDataMesAno"
        id="data"
        class="full-width"
        v-model="form.data"
        :type="'month' as any"
        outlined
        @update:model-value="emitData"
        :rules="isRequired ? [validarCampo] : []"
      />
      <q-input
        v-else
        id="data"
        class="full-width"
        v-model="form.data"
        type="date"
        outlined
        @update:model-value="emitData"
        :rules="isRequired ? [validarCampo] : []"
      />
    </q-item>
    <q-item class="column col-md-4 col-sm-12 col-xs-12">
      <label class="text-bold custom-color-tertiary" for="preco">Preço da Despesa</label>
      <q-input
        id="preco"
        class="full-width"
        v-model="form.preco"
        placeholder="Insira o preço pago pela despesa"
        outlined
        v-money="money"
        @update:model-value="emitPreco"
        :rules="isRequired ? [validarCampoValor] : []"
      />
    </q-item>
    <q-item v-if="isExpandirFormulario" class="column col-12">
      <label class="text-bold custom-color-tertiary" for="preco">Observação</label>
      <q-input
        id="observacao"
        class="full-width"
        v-model="form.observacao"
        type="textarea"
        placeholder="Insira uma observação sobre a despesa."
        outlined
        counter
        @update:model-value="emitObservacao"
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

  emits: ['emitDescricao', 'emitData', 'emitPreco', 'emitObservacao'],

  directives: { money: VMoney },

  props: {
    isRequired: {
      type: Boolean,
      required: true,
    },

    isDataMesAno: {
      type: Boolean,
      required: true,
    },

    isExpandirFormulario: {
      type: Boolean,
      required: false,
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
        observacao: shallowRef<string>(''),
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

    emitObservacao(observacao: string): void {
      this.$emit('emitObservacao', observacao);
    },

    validarCampo(valorDigitado): boolean {
      return !!valorDigitado;
    },

    validarCampoValor(valorDigitado): boolean {
      if (valorDigitado === 'R$ 0,00') {
        return false;
      }

      return true;
    },

    limparCampos(): void {
      this.form.descricao = '';
      this.form.data = '';
      this.form.preco = '';
    },
  },
});
</script>
