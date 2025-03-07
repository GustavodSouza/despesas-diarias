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
        <q-form ref="formularioLogin">
          <q-item class="column full-width q-gutter-y-md">
            <q-input
              class="col-12"
              v-model="form.email"
              label="E-mail"
              :rules="[validarCampoEmail]"
              hide-bottom-space
            />
            <q-input
              v-model="form.senha"
              bottom-slots
              label="Senha"
              counter
              minlength="12"
              :type="inputType"
              :rules="[validarCampo]"
            >
              <template v-slot:append>
                <q-icon
                  class="cursor-pointer"
                  :name="inputType === 'password' ? 'visibility_off' : 'visibility'"
                  @click="mudarVisibilidadeSenha"
                />
              </template>
            </q-input>
          </q-item>
          <q-item class="row q-pt-md q-gutter-x-md">
            <q-btn color="primary" no-caps label="Entrar" @click="realizarLogin" />
            <q-btn
              color="warning"
              no-caps
              label="Limpar Campos"
              @click="limparCampos"
              hide-bottom-space
            />
            <!-- <img
              class="cursor-pointer"
              style="width: 35px; height: 35px; margin-left: 100px"
              src="../assets/google.png"
              alt="Logo Google"
              @click="loginGoogle"
            /> -->
          </q-item>
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="criarConta">
        <q-form ref="formularioCadastro">
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
              :rules="[validarCampoEmail]"
              hide-bottom-space
            />
            <q-input
              v-model="form.senha"
              bottom-slots
              label="Senha"
              counter
              minlength="12"
              :type="inputType"
              :rules="[validarCampoSenha]"
            >
              <template v-slot:append>
                <q-icon
                  class="cursor-pointer"
                  :name="inputType === 'password' ? 'visibility_off' : 'visibility'"
                  @click="mudarVisibilidadeSenha"
                />
              </template>
            </q-input>
          </q-item>
          <q-item class="row q-pt-md q-gutter-x-md">
            <q-btn color="primary" no-caps label="Cadastrar" @click="registrarUsuario" />
            <q-btn
              color="warning"
              no-caps
              label="Limpar Campos"
              @click="limparCampos"
              hide-bottom-space
            />
            <!-- <img
              class="cursor-pointer"
              style="width: 35px; height: 35px; margin-left: 100px"
              src="../assets/google.png"
              alt="Logo Google"
              @click="loginGoogle"
            /> -->
          </q-item>
        </q-form>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue';

import {
  atribuirInformacoesPerfilUsuario,
  criarContaUsuario,
  realizarLogin,
  buscarUsuarioPorUid,
  realizarLoginGoogle,
} from 'src/services/UsuarioService';

import { usuarioStore } from 'src/stores/UsuarioStore';

import { showLoader, hideLoader } from 'src/plugins/loaderPlugin';

import { notify } from 'src/utils/notifyUtils';

export default defineComponent({
  name: 'LoginComponent',

  data() {
    const usuarioStoreInstance = usuarioStore();

    return {
      tab: ref('logar'),
      form: {
        nome: shallowRef<string>(''),
        sobrenome: shallowRef<string>(''),
        email: shallowRef<string>(''),
        senha: shallowRef<string>(''),
      },
      usuarioStoreInstance,
      inputType: 'password' as 'password' | 'text',
    };
  },

  methods: {
    async registrarUsuario(): Promise<void> {
      this.$refs.formularioCadastro.validate().then(async (isFormularioValido: boolean) => {
        const informacoesBasicas = {
          email: this.form.email,
          senha: this.form.senha,
        };

        if (isFormularioValido) {
          // 1º Registra o usuário no authentication
          const response = await criarContaUsuario({
            ...informacoesBasicas,
          });

          if (response) {
            // 2º Registra o usuário no firestore
            const payload = {
              nome: this.form.nome,
              sobrenome: this.form.sobrenome,
              uid: response.user.uid,
              ...informacoesBasicas,
            };

            await atribuirInformacoesPerfilUsuario(payload).then(() => {
              this.limparCampos();
              this.tab = 'logar';
            });
          }
        } else {
          console.log('Formulario invalido');
        }
      });
    },

    async realizarLogin(): Promise<void> {
      this.$refs.formularioLogin.validate().then(async (isFormularioValido: boolean) => {
        if (isFormularioValido) {
          showLoader();
          await realizarLogin({
            email: this.form.email,
            senha: this.form.senha,
          })
            .then(async (response) => {
              const usuario = await buscarUsuarioPorUid(response.user.uid);

              usuario.forEach((usuarioItem) => {
                const usuarioData = usuarioItem.data();

                this.usuarioStoreInstance.setUsuario({
                  uid: usuarioData.uid,
                  nome: usuarioData.nome,
                  sobrenome: usuarioData.sobrenome,
                  email: usuarioData.email,
                });
              });

              this.$router.push('/home');
            })
            .catch((error) => {
              if (
                error.code === 'auth/invalid-credential' ||
                error.code === 'auth/wrong-password'
              ) {
                notify('negative', 'Credenciais inválidas!');
              }

              if (error.code === 'auth/user-not-found') {
                notify('negative', 'Usuário não encontrado em nossas bases!');
              }
            })
            .finally(hideLoader);
        }
      });
    },

    async loginGoogle(): Promise<void> {
      await realizarLoginGoogle();
    },

    validarCampo(valorDigitado: string) {
      if (!valorDigitado) {
        return 'Preencha o campo.';
      }
      return true;
    },

    validarCampoEmail(valorDigitado: string) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return (
        emailRegex.test(valorDigitado) ||
        'Por favor, insira um e-mail válido. (Ex: seunome@gmail.com)'
      );
    },

    validarCampoSenha(valorDigitado: string) {
      if (valorDigitado.length < 8) {
        return 'A senha deve conter no mínimo 8 caracteres.';
      }

      return true;
    },

    limparCampos(): void {
      this.form.nome = '';
      this.form.sobrenome = '';
      this.form.senha = '';
      this.form.email = '';
    },

    mudarVisibilidadeSenha(): void {
      this.inputType = this.inputType === 'password' ? 'text' : 'password';
    },
  },
});
</script>
