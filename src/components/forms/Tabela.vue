<template>
  <q-table
    class="full-width fixar-ultima-coluna-tabela"
    :columns="colunas"
    :rows="rows"
    :rows-per-page-options="[10, 20, 50, 100]"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td class="row items-center no-wrap q-gutter-x-md">
          <span>{{ props.row.descricao }}</span>
          <q-icon
            v-if="props.row.observacao"
            class="cursor-pointer"
            size="xs"
            color="info"
            :name="icons.fasCircleInfo"
            @click="openModalGenerico(props.row.observacao)"
          />
        </q-td>
        <q-td>
          {{ formatarData(props.row.data) }}
        </q-td>
        <q-td> <strong>R$</strong> {{ formatarPreco(props.row.preco) }} </q-td>
        <q-td>
          <div class="row q-gutter-x-md no-wrap">
            <q-icon
              class="cursor-pointer"
              size="xs"
              color="primary"
              :name="icons.fasPenToSquare"
              @click="editarDespesa(props.row)"
            />
            <q-icon
              class="cursor-pointer"
              size="xs"
              color="negative"
              :name="icons.fasCircleXmark"
              @click="excluirDespesa(props.row)"
            />
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { IDespesa } from 'src/interfaces/DespesaInterface';
import type { ITabela } from 'src/interfaces/TabelaInterface';

import { fasCircleInfo, fasCircleXmark, fasPenToSquare } from '@quasar/extras/fontawesome-v6';
import { parseISO, format } from 'date-fns';

const colunas = [
  {
    name: 'descricao',
    required: true,
    label: 'Descrição',
    align: 'left',
    field: 'descricao',
    sortable: false,
    headerClasses: '',
    headerStyle: 'font-size: 13px; font-weight: bold; background-color: #f8f9fa',
    style: '',
  },
  {
    name: 'data',
    required: true,
    label: 'Data da Despesa',
    align: 'left',
    field: 'data',
    sortable: false,
    headerClasses: '',
    headerStyle: 'font-size: 13px; font-weight: bold; background-color: #f8f9fa',
    style: '',
  },
  {
    name: 'preco',
    required: true,
    label: 'Preço pago',
    align: 'left',
    field: 'preco',
    sortable: false,
    headerClasses: '',
    headerStyle: 'font-size: 13px; font-weight: bold; background-color: #f8f9fa',
    style: '',
  },
  {
    name: 'acao',
    required: true,
    label: 'Ações',
    align: 'left',
    field: 'acao',
    sortable: false,
    headerClasses: '',
    headerStyle: 'font-size: 13px; font-weight: bold; background-color: #dbead5; width: 8%',
    style: '',
  },
] as Array<ITabela>;

export default defineComponent({
  name: 'TabelaComponent',

  emits: ['open-modal-observacao', 'editar-despesa', 'excluir-despesa'],

  props: {
    rows: {
      type: Array<IDespesa>,
      required: true,
    },
  },

  data() {
    return {
      colunas,
      icons: {
        fasCircleInfo,
        fasCircleXmark,
        fasPenToSquare,
      },
    };
  },

  methods: {
    openModalGenerico(observacao: string): void {
      this.$emit('open-modal-observacao', observacao);
    },

    formatarData(data: string): string {
      const parsedDate = parseISO(data);
      return format(parsedDate, 'dd/MM/yyyy');
    },

    formatarPreco(preco: number) {
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(preco);
    },

    excluirDespesa(despesa: IDespesa): void {
      this.$emit('excluir-despesa', despesa);
    },

    editarDespesa(despesa: IDespesa): void {
      this.$emit('editar-despesa', despesa);
    },
  },
});
</script>
