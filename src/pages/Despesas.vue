<template>
  <q-item>
    <q-card class="my-card full-width">
      <q-card-section>
        <span class="text-bold text-h6">Registrar Nova Despesa</span>
      </q-card-section>

      <q-card-section>
        <q-card class="row no-box-shadow">
          <q-item class="col-md-6 col-12">
            <q-card class="full-width q-pa-md q-pr-md">
              <div class="row items-center">
                <span class="text-h6">Mês Filtrado</span>
                <q-icon class="q-pl-md" size="xs" :name="icons.fasCalendarCheck" />
              </div>
              <span>Teste</span>
            </q-card>
          </q-item>

          <q-item class="col-md-6 col-12">
            <q-card class="full-width q-pa-md">
              <div class="row items-center">
                <span class="text-h6">Total</span>
                <q-icon class="q-pl-md" size="xs" :name="icons.fasSackDollar" />
              </div>
              <span>TEste</span>
            </q-card>
          </q-item>
        </q-card>
      </q-card-section>

      <q-card-section>
        <q-item class="row">
          <q-card class="full-width">
            <div class="q-pa-md">
              <span class="text-bold">Formulário de Lançamento</span>
            </div>
            <q-form class="row">
              <q-item class="col-md-4 col-sm-12 col-xs-12">
                <q-input class="full-width" v-model="form.descricao" outlined label="Descrição" />
              </q-item>
              <q-item class="col-md-4 col-sm-12 col-xs-12">
                <q-input
                  class="full-width"
                  v-model="form.descricao"
                  outlined
                  label="Data da Despesa"
                />
              </q-item>
              <q-item class="col-md-4 col-sm-12 col-xs-12">
                <q-input class="full-width" v-model="form.descricao" outlined label="Preço Pago" />
              </q-item>
              <q-item class="row q-gutter-md">
                <q-btn no-caps color="primary" label="Confirmar" />
                <q-btn no-caps color="warning" label="Limpar" />
              </q-item>
            </q-form>
          </q-card>
        </q-item>
      </q-card-section>

      <q-card-section>
        <q-item>
          <q-table :rows="[]" />
        </q-item>
      </q-card-section>
    </q-card>
  </q-item>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { fasCalendarCheck, fasSackDollar } from '@quasar/extras/fontawesome-v6';

export default defineComponent({
  name: 'DespesaComponent',
  data() {
    return {
      form: {
        descricao: '',
      },
      icons: {
        fasCalendarCheck,
        fasSackDollar,
      },
    };
  },
});
</script>
