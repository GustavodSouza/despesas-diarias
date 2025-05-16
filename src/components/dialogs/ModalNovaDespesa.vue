<template>
  <q-dialog v-model="isOpen" @hide="limparCampos">
    <q-card style="max-width: 930px; width: 930px">
      <q-card-section class="row items-center q-pb-none">
        <q-card class="full-width" flat>
          <q-item class="row justify-between">
            <div class="row items-center q-gutter-md">
              <span class="text-h6 custom-color-primary">Registrar Nova Despesa</span>
              <q-icon
                class="cursor-pointer"
                :name="isExpandirFormulario ? icons.fasMinus : icons.fasPlus"
                @click="isExpandirFormulario = !isExpandirFormulario"
              >
                <q-tooltip>
                  <span v-if="isExpandirFormulario">Recolher formulário.</span>
                  <span v-else>Expandir formulário.</span>
                </q-tooltip>
              </q-icon>
            </div>
          </q-item>
        </q-card>
      </q-card-section>

      <q-card-section>
        <form-despesa
          ref="formularioComponente"
          @emit-form="form = $event"
          :is-required="true"
          :is-expandir-formulario="isExpandirFormulario"
          :form-props="form"
        >
          <template #botoes>
            <q-item class="row q-gutter-md col-12">
              <q-btn no-caps color="primary" label="Confirmar" @click="adicionarDespesa" />
              <q-btn no-caps color="warning" label="Limpar" @click="limparCampos" />
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

import { usuarioStore } from 'src/stores/UsuarioStore';
import { notify } from 'src/utils/notifyUtils';
import { hideLoader, showLoader } from 'src/plugins/loaderPlugin';

import { postDespesa, updateDespesa } from 'src/services/DespesaService';

import { fasPlus, fasMinus } from '@quasar/extras/fontawesome-v6';
import { MesesConstant } from 'src/constants/MesesConst';
import { formatarMonetarioBRparaArmazenamento } from 'src/helpers/monetario-helpers';

import type { IDespesa } from 'src/interfaces/DespesaInterface';

import { nextTick } from 'process';

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
      form: {
        descricao: shallowRef<string>(''),
        data: shallowRef<string>(''),
        preco: shallowRef<string>(''),
        observacao: shallowRef<string>(''),
        id: shallowRef<string>(''),
      },
      icons: {
        fasPlus,
        fasMinus,
      },
      isLimparCampos: shallowRef<boolean>(false),
      isExpandirFormulario: shallowRef<boolean>(false),
      isEditar: shallowRef<boolean>(false),
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
        this.form.descricao = params.descricao;
        this.form.data = params.data;
        this.form.preco = Number(params.preco).toFixed(2);
        this.form.id = params.id;

        if (params.observacao !== '') {
          this.form.observacao = params.observacao;
          this.isExpandirFormulario = true;
        }

        if (params.id) {
          this.isEditar = true;
        }
      }
    },

    toogleModal(valor: boolean): void {
      this.isOpen = valor;
    },

    async adicionarDespesa(): Promise<void> {
      this.$refs.formularioComponente.$refs.formulario
        .validate()
        .then(async (isFormularioValido: boolean) => {
          if (isFormularioValido) {
            showLoader();

            const date = new Date(this.form.data);

            const payloadDespesa: IDespesa = {
              descricao: this.form.descricao,
              data: this.form.data,
              preco: formatarMonetarioBRparaArmazenamento(this.form.preco),
              observacao: this.form.observacao,
              dt_reg: new Date().toLocaleString(),
              mes_ref: MesesConstant()[date.getUTCMonth()] ?? '',
              ano_ref: date.getFullYear(),
              id: this.form.id ?? '',
            };

            if (this.isEditar) {
              this.updateDespesa(payloadDespesa);
              return;
            }

            this.postDespesa(payloadDespesa);
            this.limparCampos();
          } else {
            notify('warning', 'Preencha todos os campos.');
          }
        });
    },

    postDespesa(despesa: IDespesa): void {
      postDespesa(despesa, this.usuarioStoreInstance.user.uid)
        .then(() => {
          notify('positive', 'Despesa criada com sucesso.');
          this.limparCampos();
          this.toogleModal(false);
          this.$emit('carregarTabela');
        })
        .catch(() => {
          notify('negative', 'Erro ao registrar a despesa. Tente novamente mais tarde!');
        })
        .finally(() => {
          hideLoader();
        });
    },

    updateDespesa(despesa: IDespesa): void {
      updateDespesa(despesa, this.usuarioStoreInstance.user.uid)
        .then(() => {
          notify('positive', 'Despesa atualizada com sucesso.');
          this.limparCampos();
          this.toogleModal(false);
          this.$emit('carregarTabela');
        })
        .catch(() => {
          notify('negative', 'Erro ao atualizar a despesa. Tente novamente mais tarde!');
        })
        .finally(() => {
          hideLoader();
        });
    },

    limparCampos(): void {
      this.form.descricao = '';
      this.form.data = '';
      this.form.preco = '';
      this.form.observacao = '';
      this.form.id = '';
      this.isExpandirFormulario = false;
      this.isEditar = false;
    },
  },
});
</script>
