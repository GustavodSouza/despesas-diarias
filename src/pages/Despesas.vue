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
              <span class="text-h6">{{ mesVigente }}</span>
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
            <div class="row q-gutter-sm items-center q-pa-md">
              <span class="text-bold">Filtros</span>
            </div>
            <form-despesa
              ref="formularioComponente"
              @emit-descricao="form.descricao = $event"
              @emit-data="form.data = $event"
              @emit-preco="form.preco = $event"
              :is-required="false"
              :is-data-mes-ano="true"
            >
              <template #botoes>
                <q-item class="row q-gutter-md col-12">
                  <q-btn no-caps color="primary" label="Filtrar" @click="filtrarDespesa" />
                  <q-btn no-caps color="warning" label="Limpar" @click="limparCampos" />
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
  <modal-nova-despesa ref="despesaDialog" @carregar-tabela="obterTodasDespesas" />
  <modal-generico ref="modalGenerico">
    <template #titulo>
      <span class="text-h6">Detalhes da Observação</span>
    </template>
    <template #conteudo>
      <q-card class="full-width box-container no-box-shadow q-mb-md q-ml-none">
        <span class="text-bold">
          {{ observacao }}
        </span>
      </q-card>
    </template>
  </modal-generico>
</template>
<script lang="ts">
import { defineComponent, shallowRef, ref } from 'vue';
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
import { format, parseISO } from 'date-fns';

import FormDespesa from 'src/components/forms/FormDespesa.vue';

import ModalNovaDespesa from 'src/components/dialogs/ModalNovaDespesa.vue';
import ModalGenerico from 'src/components/dialogs/ModalGenerico.vue';

import { usuarioStore } from 'src/stores/UsuarioStore';

import { obterTodasDespesasPorIdUsuario } from 'src/services/DespesaService';
import { hideLoader, showLoader } from 'src/plugins/loaderPlugin';

import { calcularTotalDespesas } from 'src/helpers/monetario-helpers';

import { MesesConstant } from 'src/constants/MesesConst';

import { filtrarDespesa } from 'src/services/DespesaService';

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
  name: 'DespesaComponent',

  components: {
    FormDespesa,
    ModalNovaDespesa,
    ModalGenerico,
  },

  data() {
    const usuarioStoreInstance = usuarioStore();

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

      valorTotal: shallowRef<number>(0),
      colunas,
      rows: ref<Array<IDespesa>>([]),
      usuarioStoreInstance,
      mesVigente: ref(MesesConstant()[new Date().getMonth()]),
      observacao: shallowRef<string>(''),
    };
  },

  async mounted() {
    this.obterTodasDespesas();
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
      const parsedDate = parseISO(data);
      return format(parsedDate, 'dd/MM/yyyy');
    },

    formatarPreco(preco: number) {
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(preco);
    },

    openModalNovaDespesa(): void {
      this.$refs.despesaDialog.openModal();
    },

    openModalGenerico(observacao: string): void {
      this.observacao = observacao;
      this.$refs.modalGenerico.openModal();
    },

    async obterTodasDespesas(): Promise<void> {
      showLoader();

      await obterTodasDespesasPorIdUsuario(this.usuarioStoreInstance.user.uid)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            this.rows = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(), // Adiciona os dados da despesa
            }));
          }
        })
        .catch(() => {
          notify(
            'negative',
            'Ocorreu um erro ao carregar as despesas. Tente novamente mais tarde!',
          );
        })
        .finally(() => {
          this.obterTotalDespesa();
          hideLoader();
        });
    },

    obterTotalDespesa(): void {
      const listaTotais = this.rows.map((despesa: IDespesa) => despesa.preco);
      this.valorTotal = calcularTotalDespesas(listaTotais);
    },

    async filtrarDespesa(): Promise<void> {
      showLoader();

      await filtrarDespesa(this.form, this.usuarioStoreInstance.user.uid)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            this.rows = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(), // Adiciona os dados da despesa
            }));
          } else {
            this.rows = [];
            notify('warning', 'Nenhum registro foi encontrado com o(s) filtro(s) informados!');
          }
        })
        .catch(() => {
          notify('negative', 'Ocorreu um erro ao filtrar a despesa. Tente novamente mais tarde!');
        })
        .finally(() => {
          this.obterTotalDespesa();
          hideLoader();
        });
    },

    limparCampos(): void {
      this.form.descricao = '';
      this.form.data = '';
      this.form.preco = '';
      this.$refs.formularioComponente.limparCampos();
    },
  },
});
</script>

<style lang="scss" scoped>
.box-container {
  border: 1px solid gray;
  min-height: 200px;
  border-radius: 13px;
  padding: 20px;
}
</style>
