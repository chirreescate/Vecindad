<template>
  <v-card>
    <v-card-title>
      Tickets
      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchTerm"
        append-icon="search"
        label="Buscar"
        single-line
        hide-details
        @keyup.enter="$emit('search', searchTerm)"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="tickets"
      :total-items="totalTickets"
      :loading="loading"
      class="elevation-0 table-striped"
      :pagination="pagination"
      @update:pagination="$emit('update:pagination', $event)"
    >
      <template slot="items" slot-scope="{ item }">
        <td>{{ item.id }}</td>
        <td class="text-xs-left">{{ item.created_at }}</td>
        <td class="text-xs-left">{{ item.updated_at }}</td>
        <td>{{ item.category.name }}</td>
        <td v-if="isAdmin" class="text-xs-left">{{ item.user.name }}</td>
        <td class="text-xs-left">{{ item.message }}</td>
        <td class="text-xs-left">
          <v-chip
            label
            small
            :color="statusesInfo[item.status.name].color"
            text-color="white"
          >
            {{ item.status.name }}
          </v-chip>
        </td>
        <td>
          <v-icon small class="mr-2" @click="$emit('view-item', item)">
            remove_red_eye
          </v-icon>
          <v-icon v-if="isAdmin" small @click="$emit('edit-item', item)">
            edit
          </v-icon>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import statusesInfo from "../../utils/ticketStatusesInfo";

export default {
  name: "TicketList",
  props: {
    tickets: {
      type: Array,
      default: () => []
    },
    totalTickets: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      statusesInfo,
      searchTerm: ""
    };
  },
  computed: {
    ...mapGetters(["isAdmin"]),
    headers() {
      if (this.isAdmin) {
        return [
          { text: "#", value: "id", sortable: false },
          { text: "Fecha creación", value: "created_at", sortable: false },
          {
            text: "Última actualización",
            value: "updated_at",
            sortable: false
          },
          { text: "Categoría", value: "category", sortable: false },
          { text: "Vecino", value: "user", sortable: false },
          { text: "Mensaje", value: "message", sortable: false },
          { text: "Estado", value: "status", sortable: false },
          { text: "Acciones", value: "name", sortable: false }
        ];
      } else {
        return [
          { text: "#", value: "id", sortable: false },
          { text: "Fecha creación", value: "created_at", sortable: false },
          {
            text: "Última actualización",
            value: "updated_at",
            sortable: false
          },
          { text: "Categoría", value: "category", sortable: false },
          { text: "Mensaje", value: "message", sortable: false },
          { text: "Estado", value: "status", sortable: false },
          { text: "Acciones", value: "name", sortable: false }
        ];
      }
    }
  }
};
</script>
