<template>
  <q-item v-if="!$q.platform.is.mobile">
    <q-card class="full-width">
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

          <tabela-component
            :rows="rows"
            @open-modal-observacao="openModalGenerico($event)"
            @excluir-despesa="excluirDespesa"
          />
        </q-item>
      </q-card-section>
    </q-card>
  </q-item>

  <q-item v-else class="column q-pa-none">
    <span class="full-width text-bold text-center text-h6">Registrar Nova Despesa</span>

    <q-card class="full-width q-py-md q-mt-md">
      <div class="row justify-center items-center">
        <span class="text-h6">Mês Filtrado</span>
        <q-icon class="q-pl-md" size="xs" :name="icons.fasCalendarCheck" />
      </div>
      <div class="row justify-center">
        <span class="text-center text-h6">{{ mesVigente }}</span>
      </div>
    </q-card>

    <q-card class="full-width q-py-md q-mt-md">
      <div class="row justify-center items-center q-pb-md">
        <span class="text-h6">Total</span>
        <q-icon class="q-pl-md" size="xs" :name="icons.fasSackDollar" />
      </div>
      <div class="row justify-center items-center q-gutter-x-sm">
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

    <q-card class="full-width q-mt-md">
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

    <q-card class="full-width q-mt-md">
      <div class="row q-px-md q-py-md">
        <q-btn color="positive" no-caps label="Nova Despesa" @click="openModalNovaDespesa" />
      </div>

      <tabela-component :rows="rows" @open-modal-observacao="openModalGenerico($event)" />
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

import type { IDespesa } from 'src/interfaces/DespesaInterface';

import FormDespesa from 'src/components/forms/FormDespesa.vue';

import ModalNovaDespesa from 'src/components/dialogs/ModalNovaDespesa.vue';
import ModalGenerico from 'src/components/dialogs/ModalGenerico.vue';
import TabelaComponent from 'src/components/forms/Tabela.vue';

import { usuarioStore } from 'src/stores/UsuarioStore';

import { deleteDespesa, obterTodasDespesasPorIdUsuario } from 'src/services/DespesaService';
import { hideLoader, showLoader } from 'src/plugins/loaderPlugin';

import { calcularTotalDespesas } from 'src/helpers/monetario-helpers';

import { MesesConstant } from 'src/constants/MesesConst';

import { filtrarDespesa } from 'src/services/DespesaService';

import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'DespesaComponent',

  components: {
    FormDespesa,
    ModalNovaDespesa,
    ModalGenerico,
    TabelaComponent,
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
      rows: ref<Array<IDespesa>>([]),
      usuarioStoreInstance,
      mesVigente: ref(),
      observacao: shallowRef<string>(''),
      $q: useQuasar(),
    };
  },

  mounted() {
    this.obterTodasDespesas();
    this.mesVigente = this.obterMesVigente();
  },

  watch: {
    'form.data': {
      handler(value) {
        debugger;
        if (!value) {
          this.mesVigente = this.obterMesVigente();
        } else {
          const mesFiltrado = new Date(value + '-01').getMonth() + 1;
          this.mesVigente = MesesConstant()[mesFiltrado];
        }
      },
    },
  },

  methods: {
    obterMesVigente(): string {
      const mesVigente = MesesConstant()[new Date().getMonth()];
      return mesVigente ?? '';
    },

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
          this.rows = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(), // Adiciona os dados da despesa
          }));
          console.log(this.rows);
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

    formatarPreco(preco: number) {
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(preco);
    },

    excluirDespesa(despesa: IDespesa): void {
      showLoader();

      const idDespesa = despesa.id ?? '';
      deleteDespesa(this.usuarioStoreInstance.user.uid, idDespesa)
        .then(() => {
          notify('positive', 'Despesa excluída com sucesso!');
          this.obterTodasDespesas();
        })
        .catch(() => {
          console.error('Erro ao excluír a despesa!');
        })
        .finally(hideLoader);
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
