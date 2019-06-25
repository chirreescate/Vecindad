<template>
  <v-container grid-list-xl fluid>
    <v-progress-circular
      v-if="loadingTicket"
      :size="50"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-layout v-if="ticket" row wrap>
      <v-flex sm12>
        <v-card>
          <v-card-title><h3>Información del ticket</h3></v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <template>
              <v-alert
                outline
                :color="statusesInfo[ticket.status.name].color"
                icon="check_circle"
                :value="true"
              >
                {{ statusesInfo[ticket.status.name].description }}
              </v-alert>
              <blockquote class="blockquote">
                {{ ticket.message }}
              </blockquote>
            </template>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex sm12>
        <v-card>
          <v-card-title><h3>Comentarios</h3></v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <template>
              <form>
                <v-textarea
                  v-model="form.message"
                  outline
                  label="Mensaje"
                  auto-grow
                  rows="2"
                ></v-textarea>
                <v-btn
                  :loading="creatingComment"
                  color="primary"
                  @click="createComment"
                  >Enviar</v-btn
                >
              </form>

              <v-list three-line>
                <template v-for="(item, index) in ticket.comments">
                  <div :key="index">
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>{{
                          item.user.name
                        }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{
                          item.message
                        }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-divider
                      v-if="index < ticket.comments.length - 1"
                    ></v-divider>
                  </div>
                </template>
              </v-list>
            </template>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "../http";
import { mapState } from "vuex";
import statusesInfo from "../utils/ticketStatusesInfo";
// import Echo from "laravel-echo";

export default {
  name: "SingleTicketPage",
  data() {
    return {
      ticket: null,
      loadingTicket: false,
      creatingComment: false,
      form: {
        message: ""
      },
      statusesInfo
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.session.currentUser,
      token: state => state.session.token
    })
  },
  async mounted() {
    try {
      this.loadingTicket = true;
      const { data } = await axios.get(`/ticket/${this.$route.params.id}`);
      this.ticket = data;
    } finally {
      this.loadingTicket = false;
    }

    // PUSHER EVENT LISTENING EXAMPLE
    // const options = {
    //   broadcaster: "pusher",
    //   key: process.env.VUE_APP_PUSHER_APP_KEY,
    //   cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
    //   authEndpoint: process.env.VUE_APP_PUSHER_AUTH_ENDPOINT,
    //   auth: {
    //     headers: {
    //       Authorization: `Bearer ${this.token}`,
    //       Accept: "application/json"
    //     }
    //   }
    // };
    // const echo = new Echo(options);
    // echo
    //   .private(`App.User.${this.currentUser.user_id}`)
    //   .notification(data => console.log("dataaaa", data));
  },
  methods: {
    async createComment() {
      if (!this.form.message) return;

      try {
        this.creatingComment = true;
        const { status } = await axios.post(`/comment/create`, {
          ...this.form,
          ticket_id: this.ticket.id
        });
        if (status === 201) {
          this.ticket = {
            ...this.ticket,
            comments: [
              { message: this.form.message, user: this.currentUser },
              ...this.ticket.comments
            ]
          };
          this.form.message = "";
        }
      } finally {
        this.creatingComment = false;
      }
    }
  }
};
</script>
