<template>
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <v-flex sm12>
        <v-card>
          <v-card-text class="pa-0">
            <template>
              <new-ticket-form v-if="!isAdmin" @submit="createTicket" />
            </template>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm12>
        <v-card>
          <v-card-text class="pa-0">
            <template>
              <ticket-list
                :tickets="tickets"
                :loading="loadingTickets"
                :total-tickets="totalTickets"
                :pagination.sync="pagination"
                @search="searchTickets"
                @view-item="visitTicketPage"
                @edit-item="editTicket"
              />
            </template>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="editFormOpen" persistent max-width="600px">
      <edit-ticket-form
        :initial-values="editingTicket"
        @close="editFormOpen = false"
        @submit="updateTicket"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import NewTicketForm from "@/components/ticket/NewTicketForm";
import EditTicketForm from "@/components/ticket/EditTicketForm";
import TicketList from "@/components/ticket/TicketList";

import axios from "../http";

const defaultPagination = {
  page: 1,
  rowsPerPage: 5,
  descending: false,
  sortBy: null,
  totalItems: 0
};

export default {
  name: "TicketPage",
  components: {
    NewTicketForm,
    EditTicketForm,
    TicketList
  },
  data() {
    const { page = 1, rowsPerPage = 5 } = this.$route.params;

    return {
      tickets: [],
      totalTickets: 0,
      loadingTickets: false,
      searchTerm: "",
      pagination: {
        ...defaultPagination,
        page,
        rowsPerPage
      },
      editFormOpen: false,
      editingTicket: undefined
    };
  },
  computed: {
    ...mapGetters(["isAdmin"]),
    ...mapState(["ticketStatuses"])
  },
  watch: {
    pagination: {
      handler(newPagination, oldPagination) {
        if (JSON.stringify(oldPagination) !== JSON.stringify(newPagination))
          this.fetchTickets();
      },
      deep: true
    }
  },
  async mounted() {
    await this.fetchTickets();
    await this.fetchTicketStatuses();
  },
  methods: {
    ...mapActions(["fetchTicketStatuses"]),
    async fetchTickets() {
      this.loadingTickets = true;
      try {
        const { data } = await axios.get("/tickets", {
          params: {
            ...this.pagination,
            search: this.searchTerm
          }
        });
        this.tickets = data.tickets;
        this.totalTickets = data.total;
      } finally {
        this.loadingTickets = false;
      }
    },
    async createTicket(values) {
      const { status } = await axios.post("/ticket/create", {
        ...values,
        ticket_status_id: 1
      });
      if (status === 201) this.fetchTickets();
    },
    searchTickets(term) {
      this.pagination = { ...defaultPagination };
      this.searchTerm = term;
      this.fetchTickets();
    },
    editTicket(ticket) {
      this.editingTicket = {
        id: ticket.id,
        status: ticket.status.id
      };
      this.editFormOpen = true;
    },
    async updateTicket(values) {
      const { status } = await axios.post(
        `/ticket/${this.editingTicket.id}/changeStatus`,
        {
          ticket_status_id: values.status
        }
      );
      this.editFormOpen = false;
      if (status === 201) this.fetchTickets();
    },
    visitTicketPage(ticket) {
      this.$router.push({
        name: "SingleTicketPage",
        params: { id: ticket.id }
      });
    }
  }
};
</script>
