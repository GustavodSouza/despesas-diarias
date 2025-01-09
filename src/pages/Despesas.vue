<template>
  <q-item>
    <q-card class="my-card full-width">
      <q-card-section>
        <span class="text-bold text-h6">Registrar Nova Despesa</span>
      </q-card-section>

      <q-card-section>
        <q-card class="row no-box-shadow">
          <q-item class="col-md-6 col-12">
            <q-card class="full-width q-pa-md q-pr-md">
              <div class="row items-center q-pb-md">
                <span class="text-h6">Mês Filtrado</span>
                <q-icon class="q-pl-md" size="xs" :name="icons.fasCalendarCheck" />
              </div>
              <span class="text-h6">{{ mesFiltrado }}</span>
            </q-card>
          </q-item>

          <q-item class="col-md-6 col-12">
            <q-card class="full-width q-pa-md">
              <div class="row items-center q-pb-md">
                <span class="text-h6">Total</span>
                <q-icon class="q-pl-md" size="xs" :name="icons.fasSackDollar" />
              </div>
              <div class="row items-center q-gutter-x-sm">
                <span class="text-h6">R$ {{ formatarPreco(valorTotal) }}</span>
                <q-icon
                  class="cursor-pointer"
                  size="sm"
                  color="secondary"
                  :name="icons.fasCopy"
                  @click="copiar(valorTotal)"
                >
                  <q-tooltip> Copiar </q-tooltip>
                </q-icon>
              </div>
            </q-card>
          </q-item>
        </q-card>
      </q-card-section>

      <q-card-section>
        <q-item class="row">
          <q-card class="full-width">
            <div class="q-pa-md">
              <span class="text-bold">Filtros</span>
            </div>
            <form-despesa
              @emit-descricao="form.descricao = $event"
              @emit-data="form.data = $event"
              @emit-preco="form.preco = $event"
              :is-required="false"
            >
              <template #botoes>
                <q-item class="row q-gutter-md">
                  <q-btn no-caps color="primary" label="Filtrar" @click="filtrar" />
                  <q-btn no-caps color="warning" label="Limpar" />
                </q-item>
              </template>
            </form-despesa>
          </q-card>
        </q-item>
      </q-card-section>

      <q-card-section>
        <q-item class="column">
          <div class="row q-pb-md">
            <q-btn color="positive" no-caps label="Nova Despesa" @click="openModalNovaDespesa" />
          </div>
          <q-table
            class="full-width fixar-ultima-coluna-tabela"
            :columns="colunas"
            :rows="rows"
            :rows-per-page-options="[10, 20, 50, 100]"
          >
            <template #body="props">
              <q-tr :props="props">
                <q-td class="row items-center q-gutter-x-md">
                  <span>{{ props.row.descricao }}</span>
                  <q-icon color="info" :name="icons.fasCircleInfo" />
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
                    />
                    <q-icon
                      class="cursor-pointer"
                      size="xs"
                      color="negative"
                      :name="icons.fasCircleXmark"
                    />
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-item>
      </q-card-section>
    </q-card>
  </q-item>
  <despesa-dialog ref="despesaDialog" />
</template>
<script lang="ts">
import { defineComponent, shallowRef } from 'vue';
import {
  fasCalendarCheck,
  fasSackDollar,
  fasCopy,
  fasCircleInfo,
  fasPenToSquare,
  fasCircleXmark,
} from '@quasar/extras/fontawesome-v6';
import { copyToClipboard } from 'quasar';
import { notify } from 'src/utils/notifyUtils';

import type { ITabela } from 'src/interfaces/TabelaInterface';
import type { IDespesa } from 'src/interfaces/DespesaInterface';
import { date } from 'quasar';

import FormDespesa from 'src/components/forms/FormDespesa.vue';
import DespesaDialog from 'src/components/dialogs/DespesaDialog.vue';

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

const rows = [
  {
    descricao: 'Conta de Luz',
    data: '2025-01-08',
    preco: 98.44,
  },
  {
    descricao: 'Conta de Água',
    data: '2025-01-05',
    preco: 70.99,
  },
  {
    descricao: 'Plano de Saúde',
    data: '2025-01-01',
    preco: 180.44,
  },
] as Array<IDespesa>;

export default defineComponent({
  name: 'DespesaComponent',

  components: {
    DespesaDialog,
    FormDespesa,
  },

  data() {
    return {
      form: {
        descricao: shallowRef<string>(''),
        data: shallowRef<string>(''),
        preco: shallowRef<string>(''),
      },
      icons: {
        fasCalendarCheck,
        fasSackDollar,
        fasCopy,
        fasCircleInfo,
        fasPenToSquare,
        fasCircleXmark,
      },

      valorTotal: shallowRef<number>(1350.33),
      mesFiltrado: shallowRef<string>('Janeiro'),
      colunas,
      rows,
    };
  },

  methods: {
    copiar(valorTotal: number): void {
      const valorFormatado = this.formatarPreco(valorTotal);

      copyToClipboard(valorFormatado)
        .then(() => {
          notify('positive', 'Valor total copiado com sucesso.');
        })
        .catch(() => {
          notify('negative', 'Erro ao copiar o valor total.');
        });
    },

    formatarData(data: string): string {
      return date.formatDate(data, 'DD/MM/YYYY');
    },

    formatarPreco(preco: number) {
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(preco);
    },

    filtrar(): void {
      console.log('Realizando busca', this.form);
    },

    openModalNovaDespesa(): void {
      this.$refs.despesaDialog.openModal();
    },
  },
});
</script>
