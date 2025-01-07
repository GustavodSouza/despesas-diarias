<template>
  <q-card>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="logar" label="Entrar" />
      <q-tab name="criarConta" label="Criar Conta" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="logar">
        <q-form ref="formulario-logar">
          <q-item class="column full-width q-gutter-y-md">
            <q-input
              class="col-12"
              v-model="form.email"
              label="E-mail"
              :rules="[validarCampo]"
              hide-bottom-space
            />
            <q-input
              class="col-12"
              v-model="form.senha"
              label="Senha"
              :rules="[validarCampo]"
              hide-bottom-space
            />
          </q-item>
          <q-item class="row q-pt-md q-gutter-x-md">
            <q-btn color="primary" no-caps label="Entrar" />
            <q-btn
              color="warning"
              no-caps
              label="Limpar Campos"
              @click="limparCampos"
              hide-bottom-space
            />
          </q-item>
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="criarConta">
        <q-form ref="formulario-logar">
          <q-item class="column full-width q-gutter-y-md">
            <q-input
              class="col-12"
              v-model="form.nome"
              label="Nome"
              :rules="[validarCampo]"
              hide-bottom-space
            />
            <q-input
              class="col-12"
              v-model="form.sobrenome"
              label="Sobrenome"
              :rules="[validarCampo]"
              hide-bottom-space
            />
            <q-input
              class="col-12"
              v-model="form.email"
              label="E-mail"
              :rules="[validarCampo]"
              hide-bottom-space
            />
            <q-input
              class="col-12"
              v-model="form.senha"
              label="Senha"
              :rules="[validarCampo]"
              hide-bottom-space
            />
          </q-item>
          <q-item class="row q-pt-md q-gutter-x-md">
            <q-btn color="primary" no-caps label="Cadastrar" />
            <q-btn
              color="warning"
              no-caps
              label="Limpar Campos"
              @click="limparCampos"
              hide-bottom-space
            />
          </q-item>
        </q-form>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue';

export default defineComponent({
  name: 'LoginComponent',

  data() {
    return {
      tab: ref('logar'),
      form: {
        nome: shallowRef<string>(''),
        sobrenome: shallowRef<string>(''),
        email: shallowRef<string>(''),
        senha: shallowRef<string>(''),
      },
    };
  },

  methods: {
    validarCampo(valorDigitado: string): boolean {
      return !!valorDigitado;
    },

    limparCampos(): void {
      this.form.nome = '';
      this.form.sobrenome = '';
      this.form.senha = '';
      this.form.email = '';
    },
  },
});
</script>
