<template>
  <v-navigation-drawer
    id="appDrawer"
    v-model="drawer"
    :mini-variant.sync="mini"
    fixed
    :dark="$vuetify.dark"
    app
    width="200"
  >
    <v-toolbar color="primary darken-1" dark>
      <h2>Vecindad</h2>
    </v-toolbar>
    <vue-perfect-scrollbar
      class="drawer-menu--scroll"
      :settings="scrollSettings"
    >
      <v-list dense expand>
        <!--top-level link-->
        <v-list-tile
          v-if="currentUser.role_name === 'Administrador'"
          :to="{ name: 'NeighborPage' }"
          ripple="ripple"
          rel="noopener"
        >
          <v-list-tile-action>
            <v-icon>people</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Vecinos</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{ name: 'GuestPage' }" ripple="ripple" rel="noopener">
          <v-list-tile-action>
            <v-icon>portrait</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Invitados</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          v-if="['Administrador', 'Residente'].includes(currentUser.role_name)"
          :to="{ name: 'TicketPage' }"
          ripple="ripple"
          rel="noopener"
        >
          <v-list-tile-action>
            <v-icon>priority_high</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Tickets</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          v-if="['Administrador', 'Residente'].includes(currentUser.role_name)"
          :to="{ name: 'BookingPage' }"
          ripple="ripple"
          rel="noopener"
        >
          <v-list-tile-action>
            <v-icon>date_range</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Reservación</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </vue-perfect-scrollbar>
  </v-navigation-drawer>
</template>
<script>
import menu from "@/utils/menu";
import { mapState } from "vuex";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
  name: "AppDrawer",
  components: {
    VuePerfectScrollbar
  },
  props: {
    expanded: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    mini: false,
    drawer: true,
    menus: menu,
    scrollSettings: {
      maxScrollbarLength: 160
    }
  }),
  computed: {
    ...mapState({
      currentUser: state => state.session.currentUser
    })
  },
  created() {
    window.getApp.$on("APP_DRAWER_TOGGLED", () => {
      this.drawer = !this.drawer;
    });
  },

  methods: {
    genChildTarget(item, subItem) {
      if (subItem.href) return;
      if (subItem.component) {
        return {
          name: subItem.component
        };
      }
      return { name: `${item.group}/${subItem.name}` };
    }
  }
};
</script>
<style lang="scss">
#appDrawer {
  overflow: hidden;
  .drawer-menu--scroll {
    height: calc(100vh - 48px);
    overflow: auto;
  }
}
</style>
