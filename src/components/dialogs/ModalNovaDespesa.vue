<template>
  <q-dialog v-model="isOpen" @hide="limparCampos">
    <q-card style="max-width: 930px; width: 930px">
      <q-card-section class="row items-center q-pb-none">
        <q-card class="full-width" flat>
          <q-item class="row justify-between">
            <div class="row items-center q-gutter-md">
              <span class="text-h6 custom-color-primary"
                >{{ isEditar ? 'Editar' : 'Registrar Nova' }} Despesa</span
              >
              <q-icon
                v-if="!isEditar"
                class="cursor-pointer"
                :name="icons.fasPlus"
                @click="adicionarCampos"
              >
                <q-tooltip>
                  <span>Adicionar campos.</span>
                </q-tooltip>
              </q-icon>
            </div>
          </q-item>
        </q-card>
      </q-card-section>

      <q-card-section>
        <template v-for="(_, index) in forms" :key="index">
          <q-card class="q-mb-md">
            <q-btn
              v-if="index !== 0"
              class="q-ma-md float-right"
              color="red"
              size="sm"
              round
              label="X"
              @click="remover(index)"
            >
              <q-tooltip>Remover</q-tooltip>
            </q-btn>
            <form-despesa ref="formularioComponente" v-model="forms[index]!" is-required />
          </q-card>
        </template>
        <q-item class="row q-gutter-md col-12">
          <q-btn no-caps color="primary" label="Confirmar" @click="adicionarDespesa" />
          <q-btn no-caps color="warning" label="Limpar" @click="limparCampos" />
        </q-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, shallowRef, ref } from 'vue';
import FormDespesa from '../forms/FormDespesa.vue';

import { usuarioStore } from 'src/stores/UsuarioStore';
import { notify } from 'src/utils/notifyUtils';
import { hideLoader, showLoader } from 'src/plugins/loaderPlugin';

import { postDespesa, updateDespesa } from 'src/services/DespesaService';

import { fasPlus, fasMinus } from '@quasar/extras/fontawesome-v6';
import { MesesConstant } from 'src/constants/MesesConst';
import { formatarMonetarioBRparaArmazenamento } from 'src/helpers/monetario-helpers';

import type { IDespesa } from 'src/interfaces/DespesaInterface';

import { nextTick } from 'process';

type FormDespesaType = {
  descricao: string;
  data: string;
  preco: string;
  observacao: string;
};

export default defineComponent({
  name: 'ModalNovaDespesaComponent',

  components: {
    FormDespesa,
  },

  emits: ['carregarTabela'],

  data() {
    const usuarioStoreInstance = usuarioStore();

    return {
      isOpen: shallowRef<boolean>(false),
      usuarioStoreInstance,
      icons: {
        fasPlus,
        fasMinus,
      },
      isLimparCampos: shallowRef<boolean>(false),
      isExpandirFormulario: shallowRef<boolean>(false),
      isEditar: shallowRef<boolean>(false),
      form: {
        descricao: '',
        data: '',
        preco: '',
        observacao: '',
        id: '',
      },
      forms: ref<FormDespesaType[]>([{ descricao: '', data: '', observacao: '', preco: '' }]),
    };
  },

  methods: {
    openModal(params: IDespesa) {
      this.toogleModal(true);

      nextTick(() => {
        this.setParams(params);
      });
    },

    setParams(params: IDespesa): void {
      if (params) {
        this.forms[0] = {
          descricao: params.descricao,
          data: params.data,
          preco: Number(params.preco).toFixed(2),
          observacao: params.observacao,
          id: params.id,
        };

        if (params.id) {
          this.isEditar = true;
        }
      }
    },

    toogleModal(valor: boolean): void {
      this.isOpen = valor;
    },

    async adicionarDespesa(): Promise<void> {
      const refs = this.$refs.formularioComponente;

      const validacoes = await Promise.all(
        refs.map((formPai) => formPai.$refs.formulario.validate()),
      );

      const todosValidos = validacoes.every((valido) => valido);

      if (todosValidos) {
        showLoader();

        let hasError = false;
        this.forms.forEach((itemForm) => {
          const date = new Date(itemForm.data);

          const payloadDespesa: IDespesa = {
            descricao: itemForm.descricao,
            data: itemForm.data,
            preco: formatarMonetarioBRparaArmazenamento(itemForm.preco),
            observacao: itemForm.observacao,
            dt_reg: new Date().toLocaleString(),
            mes_ref: MesesConstant()[date.getUTCMonth()] ?? '',
            ano_ref: date.getFullYear(),
            id: itemForm.id ?? '',
          };

          if (this.isEditar) {
            hasError = this.updateDespesa(payloadDespesa);
          } else {
            hasError = this.postDespesa(payloadDespesa);
          }
        });

        if (!hasError) {
          notify('positive', 'Despesa salva com sucesso.');
          this.limparCampos();
          this.toogleModal(false);
          this.$emit('carregarTabela');
        }

        hideLoader();
      } else {
        notify('warning', 'Por Favor, preencha todos os campos para continuar.');
      }
    },

    postDespesa(despesa: IDespesa): boolean {
      let hasError = false;
      postDespesa(despesa, this.usuarioStoreInstance.user.uid).catch(() => {
        hasError = true;
        notify(
          'negative',
          `Erro ao registrar a despesa: ${despesa.descricao}. Tente novamente mais tarde!`,
        );
      });

      return hasError;
    },

    updateDespesa(despesa: IDespesa): boolean {
      let hasError = false;
      updateDespesa(despesa, this.usuarioStoreInstance.user.uid)
        .then()
        .catch(() => {
          hasError = true;
          notify('negative', 'Erro ao atualizar a despesa. Tente novamente mais tarde!');
        })
        .finally(() => {
          hideLoader();
        });

      return hasError;
    },

    limparCampos(): void {
      this.forms = [{ ...this.form }];
      this.isEditar = false;
    },

    adicionarCampos(): void {
      const novoForm = { ...this.form };
      this.forms.push(novoForm);
    },

    remover(index: number): void {
      this.forms = this.forms.filter((_, indexItem) => indexItem !== index);
    },
  },
});
</script>
