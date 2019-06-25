import { orderBy } from "lodash";
import axios from "../http";

const invitations = {
  state: {
    loading: false,
    items: []
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value;
    },
    setItems(state, value) {
      state.items = value;
    }
  },
  actions: {
    async fetchInvitations({ commit }) {
      commit("setLoading", false);
      const { data } = await axios.get(`/invitations`);
      console.log("invitation results", data);
      commit("setItems", orderBy(data.invitations, "invitation_date", "asc"));
      commit("setLoading", true);
    },
    // values: { "invitation_date": "2019-11-29 05:21:04", "name": "AAAAA", "dni": "70610792" }
    async createInvitation({ dispatch }, payload) {
      const result = await axios.post(`/invitation/create`, payload);
      // commit('setItems', data.invitations);
      console.log("create invitation result", result);
      await dispatch("fetchInvitations");
    },
    async editInvitation({ dispatch }, payload) {
      const id = payload.id;
      delete payload.id;
      const result = await axios.post(`/invitation/update/${id}`, payload);
      // commit('setItems', data.invitations);
      console.log("update invitation result", result);
      await dispatch("fetchInvitations");
    }
  }
};

export default invitations;
