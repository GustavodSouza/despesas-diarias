<template>
  <q-dialog v-model="isOpen">
    <q-card style="max-width: 930px; width: 930px">
      <q-card-section class="row items-center q-pb-none">
        <q-card class="full-width" flat>
          <q-item class="row justify-between">
            <div class="row items-center q-gutter-md">
              <span class="text-h6">Registrar Nova Despesa</span>
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
          @emit-descricao="form.descricao = $event"
          @emit-preco="form.preco = $event"
          @emit-data="form.data = $event"
          @emit-observacao="form.observacao = $event"
          :is-required="true"
          :is-data-mes-ano="false"
          :is-expandir-formulario="isExpandirFormulario"
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

import type { IDespesa } from 'src/interfaces/DespesaInterface';

import { criarDespesa } from 'src/services/DespesaService';

import { fasPlus, fasMinus } from '@quasar/extras/fontawesome-v6';

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
      },
      icons: {
        fasPlus,
        fasMinus,
      },
      isLimparCampos: shallowRef<boolean>(false),
      isExpandirFormulario: shallowRef<boolean>(false),
    };
  },

  methods: {
    openModal() {
      this.toogleModal(true);
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
            const payloadDespesa: IDespesa = {
              descricao: this.form.descricao,
              data: this.form.data,
              preco: this.form.preco,
              observacao: this.form.observacao,
            };

            await criarDespesa(payloadDespesa, this.usuarioStoreInstance.user.uid)
              .then(() => {
                notify('positive', 'Despesa criada com sucesso.');
                this.limparCampos();
                this.$emit('carregarTabela');
              })
              .catch(() => {
                notify('negative', 'Erro ao registrar a despesa. Tente novamente mais tarde!');
              })
              .finally(() => {
                hideLoader();
              });
          } else {
            notify('warning', 'Preencha todos os campos.');
          }
        });
    },

    limparCampos(): void {
      this.form.descricao = '';
      this.form.data = '';
      this.form.preco = '';
      this.form.observacao = '';
      this.$refs.formularioComponente.limparCampos();
    },
  },
});
</script>
