<template>
  <div id="social">
    <vue-perfect-scrollbar
      class="drawer-menu--scroll"
      :settings="scrollSettings"
    >
      <v-container grid-list-xl fluid>
        <v-layout row wrap>
          <v-toolbar card dense color="transparent">
            <v-toolbar-title><h4>Residentes</h4></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn small color="primary" @click="dialogAdd = true"
              >Agregar Vecino</v-btn
            >
          </v-toolbar>
          <template>
            <v-flex xs12>
              <v-card>
                <v-card-title>
                  <h4 class="subheading mb-2">Vecinos</h4>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="searchInvitation"
                    append-icon="search"
                    label="Buscar por Nombre o Email"
                    single-line
                    hide-details
                    class="mt-0 pt-0"
                    @keyup.enter="onSearch"
                  ></v-text-field>
                </v-card-title>

                <neighbor-list
                  :residents="residents"
                  :loading="loadingResidents"
                  :total-residents="totalResidents"
                  :pagination.sync="pagination"
                  @item-view="openDialogDetail"
                  @item-delete="openDialogDelete"
                  @item-generate-password="generatePassword"
                />
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </vue-perfect-scrollbar>

    <v-dialog v-model="dialogAdd" persistent max-width="600px">
      <neighbor-form @close="dialogAdd = false" @submit="createNeighbor" />
    </v-dialog>

    <v-dialog v-model="dialogDetail" persistent max-width="600px">
      <neighbor-detail
        v-if="dialogDetail"
        :neighbor="selectedItem"
        @close="dialogDetail = false"
      />
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="450px">
      <v-card v-if="dialogDelete">
        <v-card-title>
          <span class="subheading">Eliminar Invitado</span>
        </v-card-title>
        <v-card-text>
          <div>
            ¿Estás seguro que deseas eliminar a {{ selectedItem.name }}?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialogDelete = false">No</v-btn>
          <v-btn color="blue darken-1" flat @click="deleteNeighbor">Sí</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import NeighborForm from "@/components/neighbor/NeighborForm";
import NeighborList from "@/components/neighbor/NeighborList";
import NeighborDetail from "@/components/neighbor/NeighborDetail";
import axios from "../http";

const defaultPagination = {
  page: 1,
  rowsPerPage: 5,
  descending: false,
  sortBy: null,
  totalItems: 0
};

export default {
  name: "NeighborPage",
  components: {
    NeighborForm,
    VuePerfectScrollbar,
    NeighborList,
    NeighborDetail
  },
  data() {
    const { page = 1, rowsPerPage = 5 } = this.$route.params;

    return {
      scrollSettings: {
        maxScrollbarLength: 160
      },
      searchInvitation: null,

      dialogDelete: false,
      dialogDetail: false,
      dialogAdd: false,

      selectedItem: {},

      residents: [],
      loadingResidents: false,
      totalResidents: 0,
      pagination: {
        ...defaultPagination,
        page,
        rowsPerPage
      }
    };
  },
  computed: {},
  watch: {
    pagination: {
      handler(newPagination, oldPagination) {
        if (JSON.stringify(oldPagination) !== JSON.stringify(newPagination))
          this.fetchResidents();
      },
      deep: true
    }
  },
  async mounted() {
    await this.fetchResidents();
  },
  methods: {
    async fetchResidents() {
      this.loadingResidents = true;
      try {
        const { data } = await axios.get("/residents", {
          params: {
            ...this.pagination,
            search: this.searchInvitation
          }
        });

        this.residents = data.residents;
        this.totalResidents = data.total;
      } finally {
        this.loadingResidents = false;
      }
    },
    openDialogDelete(item) {
      this.selectedItem = item;
      this.dialogDelete = true;
    },
    openDialogDetail(item) {
      this.selectedItem = item;
      this.dialogDetail = true;
    },
    onSearch() {
      this.pagination = { ...defaultPagination };
      this.fetchResidents();
    },
    async generatePassword(item) {
      const result = await axios.post(`/resident/${item.id}/generatePassword`);
      console.log("result", result);
    },
    async createNeighbor(values) {
      const { status } = await axios.post("/resident/create", values);
      this.dialogAdd = false;
      if (status === 201) this.fetchResidents();
    },
    async deleteNeighbor() {
      const { status } = await axios.post(
        `resident/${this.selectedItem.id}/delete`
      );
      if (status === 200) this.fetchResidents();
      this.dialogDelete = false;
    }
  }
};
</script>
