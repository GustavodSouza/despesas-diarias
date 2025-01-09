<template>
  <div class="full-height">
    <q-layout view="hHh Lpr lff" style="height: 100vh; width: 100vw">
      <nav-bar :itens-menu="menuList" />

      <q-page-container>
        <q-page padding>
          <q-item padding>
            <span>Página Inicial</span>
          </q-item>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from 'src/components/common/NavBar.vue';

const menuList = [
  {
    icon: 'home',
    label: 'Página Inícial',
    separator: true,
    path: 'home',
  },
  {
    icon: 'money',
    label: 'Registrar Nova Despesa',
    separator: false,
    path: 'registrar-despesa',
  },
  {
    icon: 'newspaper',
    label: 'Relatórios',
    separator: false,
    path: 'relatorios',
  },
  {
    icon: 'people',
    label: 'Perfil',
    separator: true,
    path: 'perfil',
  },
  {
    icon: 'settings',
    label: 'Modo Noturno',
    separator: false,
    path: '',
  },
  {
    icon: 'feedback',
    label: 'Feedback',
    separator: false,
    path: 'feedback',
  },
  {
    icon: 'help',
    iconColor: 'primary',
    label: 'Ajuda',
    separator: true,
    path: 'ajuda',
  },
  {
    icon: 'logout',
    iconColor: 'primary',
    label: 'Sair',
    separator: false,
    path: '',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    NavBar,
  },

  data() {
    return {
      menuList,
      drawer: false,
    };
  },
});
</script>
