<template>
  <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
    <q-toolbar>
      <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
      <q-toolbar-title>Despesas Diárias</q-toolbar-title>
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
import { defineComponent, shallowRef } from 'vue'

interface IItensMenu {
  label: string
  icon: string
  separator: boolean
  path: string
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
    return {
      drawer: shallowRef<boolean>(false),
    }
  },

  methods: {
    navegar(rota: string): void {
      console.log('Rota', rota)
    },
  },
})
</script>
