<template>
  <v-card>
    <v-card-title>
      <span class="headline">Agregar ticket</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              v-model="form.message"
              label="Mensaje"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-select
              v-model="form.ticket_category_id"
              :items="categories"
              label="Categoría"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click="$emit('submit', form)">
        Enviar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "../../http";

export default {
  name: "NewTicketForm",
  data() {
    return {
      loading: false,
      categories: [],
      form: {
        message: "",
        ticket_category_id: null
      }
    };
  },
  async mounted() {
    const { data } = await axios.get("/ticketCategories");
    this.categories = data.ticketCategories.map(category => ({
      text: category.name,
      value: category.id
    }));
  },
  methods: {}
};
</script>
