<template>
  <v-card>
    <v-card-title>
      <span class="headline">Editar ticket</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-select v-model="form.status" :items="statuses" label="Estado" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click="$emit('close')">Cerrar</v-btn>
      <v-btn color="blue darken-1" flat @click="submit">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "EditTicketForm",
  props: {
    initialValues: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: this.initialValues
    };
  },
  computed: {
    ...mapState({
      statuses: state =>
        state.ticketStatuses.map(status => ({
          text: status.name,
          value: status.id
        }))
    })
  },
  watch: {
    initialValues(newValues) {
      this.form = newValues;
    }
  },
  methods: {
    submit() {
      this.$emit("submit", this.form);
    }
  }
};
</script>
