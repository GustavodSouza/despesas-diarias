<template>
  <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
    <q-toolbar class="row justify-between">
      <div class="row">
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>Despesas Diárias</q-toolbar-title>
      </div>
      <div class="row" v-if="usuarioStoreInstance.user.uid">
        <q-avatar color="white cursor-pointer" text-color="black">
          <span> {{ getIniciaisUsuario }} </span>

          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
                <q-toggle v-model="mobileData" label="Modo noturno" />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">
                  {{ getNomeCompletoUsuario }}
                </div>

                <q-btn color="primary" label="Sair" push size="sm" v-close-popup @click="sair" />
              </div>
            </div>
          </q-menu>
        </q-avatar>
      </div>
    </q-toolbar>
  </q-header>

  <q-drawer
    v-model="drawer"
    show-if-above
    :width="200"
    :breakpoint="500"
    bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
  >
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="(menuItem, index) in itensMenu" :key="index">
          <q-item
            clickable
            :active="menuItem.label === 'Outbox'"
            v-ripple
            @click="navegar(menuItem.path)"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + index" v-if="menuItem.separator" />
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>
<script lang="ts">
import { defineComponent, shallowRef } from 'vue';
import { usuarioStore } from 'src/stores/UsuarioStore';
import { realizarLogoutService } from 'src/services/UsuarioService';
import { hideLoader, showLoader } from 'src/plugins/loaderPlugin';

interface IItensMenu {
  label: string;
  icon: string;
  separator: boolean;
  path: string;
}

export default defineComponent({
  name: 'NavBar',

  props: {
    itensMenu: {
      type: Array<IItensMenu>,
      required: true,
    },
  },

  data() {
    const usuarioStoreInstance = usuarioStore();

    return {
      drawer: shallowRef<boolean>(false),
      usuarioStoreInstance,
      mobileData: shallowRef<boolean>(false),
    };
  },

  computed: {
    getIniciaisUsuario(): string {
      return this.usuarioStoreInstance.getUsuario.nome.charAt(0);
    },

    getNomeCompletoUsuario(): string {
      return `${this.usuarioStoreInstance.getUsuario.nome} ${this.usuarioStoreInstance.getUsuario.sobrenome}`;
    },
  },

  methods: {
    navegar(rota: string): void {
      this.$router.push(rota);
    },

    async sair(): Promise<void> {
      showLoader();

      await realizarLogoutService()
        .then(() => {
          this.usuarioStoreInstance.reset();
          this.$router.push('/login');
        })
        .finally(hideLoader);
    },
  },
});
</script>
