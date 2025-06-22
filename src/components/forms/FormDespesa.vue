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
        :rules="isRequired ? [validarCampo] : []"
      />
      <q-input
        v-else
        id="data"
        class="full-width"
        v-model="form.data"
        type="date"
        outlined
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
        :rules="isRequired ? [validarCampoValor] : []"
      />
    </q-item>
    <q-item class="column col-12" v-if="!isFormFilter">
      <label class="text-bold custom-color-tertiary" for="preco">Observação (Opcional)</label>
      <q-input
        id="observacao"
        class="full-width"
        v-model="form.observacao"
        type="textarea"
        placeholder="Insira uma observação sobre a despesa."
        outlined
        counter
      />
    </q-item>

    <!-- Inserção de botões -->
    <slot name="botoes"></slot>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VMoney } from 'v-money';

type FormDespesa = {
  descricao: string;
  data: string;
  preco: string;
  observacao?: string;
};

export default defineComponent({
  name: 'FormDespesaComponent',

  emits: ['update:form'],

  directives: { money: VMoney },

  props: {
    isRequired: {
      type: Boolean,
      required: true,
    },

    isDataMesAno: {
      type: Boolean,
      required: false,
      default: false,
    },

    isExpandirFormulario: {
      type: Boolean,
      required: false,
    },

    modelValue: {
      type: Object as () => FormDespesa,
      required: true,
    },

    isFormFilter: {
      type: Boolean,
      required: false,
      default: false,
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
        masked: true,
      },
    };
  },

  computed: {
    form: {
      get(): typeof this.modelValue {
        return this.modelValue;
      },

      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
  },

  methods: {
    validarCampo(valorDigitado: string): boolean {
      return !!valorDigitado;
    },

    validarCampoValor(valorDigitado: string): boolean {
      return valorDigitado !== 'R$ 0,00';
    },
  },
});
</script>
