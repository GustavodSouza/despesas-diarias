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
              label="E-mail*"
              :rules="[validarCampoEmail]"
              hide-bottom-space
            />
            <q-input
              v-model="form.senha"
              bottom-slots
              label="Senha*"
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
            <q-btn
              color="primary"
              no-caps
              label="Entrar"
              @click="validarFormularioPreenchidoParaLogin"
            />
            <q-btn color="warning" no-caps label="Limpar" @click="limparCampos" hide-bottom-space />
            <q-btn class="q-ml-lg" @click="loginGoogle">
              <img
                class="cursor-pointer"
                style="width: 30px; height: 30px"
                src="../assets/google.png"
                alt="Logo Google"
              />
              <q-tooltip>Login com a conta google.</q-tooltip>
            </q-btn>
          </q-item>
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="criarConta">
        <q-form ref="formularioCadastro">
          <q-item class="column full-width q-gutter-y-md">
            <q-input
              class="col-12"
              v-model="form.nome"
              label="Nome*"
              :rules="[validarCampo]"
              hide-bottom-space
            />
            <q-input
              class="col-12"
              v-model="form.sobrenome"
              label="Sobrenome*"
              :rules="[validarCampo]"
              hide-bottom-space
            />
            <q-input
              class="col-12"
              v-model="form.email"
              label="E-mail*"
              :rules="[validarCampoEmail]"
              hide-bottom-space
            />
            <q-input
              v-model="form.senha"
              bottom-slots
              label="Senha*"
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
            <q-btn color="warning" no-caps label="Limpar" @click="limparCampos" hide-bottom-space />
            <q-btn class="q-ml-lg" @click="loginGoogle">
              <img
                class="cursor-pointer"
                style="width: 30px; height: 30px"
                src="../assets/google.png"
                alt="Logo Google"
              />
              <q-tooltip>Login com a conta google.</q-tooltip>
            </q-btn>
          </q-item>
        </q-form>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>

  <modal-generico ref="modalNovaSenha">
    <template #titulo>
      <span class="text-h6"
        >Parece que você criou sua conta usando o Google. Para continuar com e-mail e senha, defina
        uma senha primeiro.</span
      >
    </template>
    <template #conteudo>
      <div>
        <span class="text-h7"
          >Um link para redefinição de senha foi enviado para seu email.
          <strong>{{ form.email }}</strong></span
        >
      </div>
      <div>
        <p>Não recebeu o link?</p>
      </div>
    </template>
  </modal-generico>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref, shallowRef } from 'vue';

import { sendPasswordResetEmail } from 'firebase/auth/web-extension';
import { auth } from 'src/boot/firebase';

import {
  atribuirInformacoesPerfilUsuarioService,
  postUsuarioAuthentication,
  buscarUsuarioPorUidService,
  realizarLoginGoogleService,
  verificarSeUsuarioExisteNaBaseComEmailService,
  realizarLoginService,
  postUsuario,
  // realizarLoginService,
} from 'src/services/UsuarioService';

import { usuarioStore } from 'src/stores/UsuarioStore';

import { showLoader, hideLoader } from 'src/plugins/loaderPlugin';
import { notify } from 'src/utils/notifyUtils';

import type IUsuario from 'src/interfaces/UsuarioInterface';

export default defineComponent({
  name: 'LoginComponent',

  components: {
    ModalGenerico: defineAsyncComponent(() => import('src/components/dialogs/ModalGenerico.vue')),
  },

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
      senha: '',
      novaSenha: '',
    };
  },

  methods: {
    async registrarUsuario(): Promise<void> {
      this.$refs.formularioCadastro.validate().then(async (isFormularioValido: boolean) => {
        if (isFormularioValido) {
          showLoader();

          const informacoesBasicas = {
            email: this.form.email,
            senha: this.form.senha,
          };

          // 1º Registra o usuário no authentication
          await postUsuarioAuthentication({
            ...informacoesBasicas,
          })
            .then((response) => {
              // 2º Registra o usuário no firestore
              this.usuarioStoreInstance.setUsuario({
                nome: this.form.nome,
                sobrenome: this.form.sobrenome,
                uid: response.user.uid,
                ...informacoesBasicas,
              });

              // this.atribuirInformacoesUsuario(this.usuarioStoreInstance.user);
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

    async validarFormularioPreenchidoParaLogin(): Promise<void> {
      this.$refs.formularioLogin.validate().then(async (isFormularioValido: boolean) => {
        if (isFormularioValido) {
          this.validarSeUsuarioCadastrado();
        }
      });
    },

    async validarSeUsuarioCadastrado(): Promise<void> {
      showLoader();

      const usuarioModel: IUsuario = {
        email: this.form.email,
        senha: this.form.senha,
      };

      await verificarSeUsuarioExisteNaBaseComEmailService(usuarioModel)
        .then(async (response) => {
          if (response.length === 1 && response.includes('google.com')) {
            // Usuário existe com esse email, abre modal para definir nova senha para vinculação
            this.$refs.modalNovaSenha.openModal();
            this.enviarLinkRedefinicaoSenha();
            return;
          }

          if (response.length) {
            this.realizarLoginEmailSenha();
          } else {
            notify('negative', 'Nenhuma conta encontrada com este email!');
          }
        })
        .catch(() => {
          notify('negative', 'Erro Inesperado, tente novamente mais tarde!');
        })
        .finally(hideLoader);
    },

    async enviarLinkRedefinicaoSenha(): Promise<void> {
      if (auth) {
        const actionCodeSettings = {
          url: 'http://localhost:9000/#/login', // URL de retorno ao app
          handleCodeInApp: true, // Indica que o link será tratado no app
        };

        await sendPasswordResetEmail(auth, this.form.email, actionCodeSettings).then((response) => {
          console.log('Reponse', response);
        });
      } else {
        await this.loginGoogle();
        this.enviarLinkRedefinicaoSenha();
      }
    },

    async realizarLoginEmailSenha(): Promise<void> {
      const usuarioInfo: IUsuario = {
        email: this.form.email,
        senha: this.form.senha,
      };

      await realizarLoginService(usuarioInfo)
        .then(async (response) => {
          debugger;
          console.log(response);
          const usuario = await buscarUsuarioPorUidService(response.user.uid);

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
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/user-not-found'
          ) {
            notify('negative', 'Credenciais inválidas!');
          }
        })
        .finally(hideLoader);
    },

    async loginGoogle(): Promise<void> {
      showLoader();

      await realizarLoginGoogleService()
        .then(async (response) => {
          const usuario = response.user;

          const novoUsuario: Partial<IUsuario> = { uid: '', nome: '', sobrenome: '', email: '' };

          if (usuario.displayName) {
            const [nome, ...resto] = usuario.displayName.split(' ');

            const sobrenome = resto.join(' ');

            novoUsuario.uid = response.user.uid;
            novoUsuario.nome = nome ?? '';
            novoUsuario.sobrenome = sobrenome;
            novoUsuario.email = response.user.email ?? '';
          }

          await postUsuario(novoUsuario)
            .then(() => {
              notify('positive', `Bem vindo(a) ${novoUsuario.nome}`);
              this.usuarioStoreInstance.setUsuario(novoUsuario);
              this.$router.push('/home');
            })
            .catch(() => {
              notify('negative', `Erro ao registrar o usuário na base de dados!`);
              return;
            })
            .finally(hideLoader);
        })
        .catch(() => console.error('Erro na autenticação com Google'))
        .finally(hideLoader);
    },

    async atribuirInformacoesUsuario(usuario: IUsuario) {
      showLoader();

      await atribuirInformacoesPerfilUsuarioService(usuario)
        .then(() => {
          this.limparCampos();
          this.tab = 'logar';
          notify('positive', `Bem vindo(a) ${usuario.nome}`);
          this.$router.push('/home');
        })
        .catch(() => {
          notify('negative', 'Ocorreu um erro ao atribuir os dados ao novo usuário!');
        })
        .finally(hideLoader);
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
