import axios from "../http";
import { uniqBy } from "lodash";

const neighbor = {
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
    async fetchNeighbor({ commit }) {
      commit("setLoading", false);
      const { data } = await axios.get(`/invitations`);
      console.log("neighbor results", data);
      commit("setItems", uniqBy(data.invitations, "user.name"));
      commit("setLoading", true);
    },
    // values: { "invitation_date": "2019-11-29 05:21:04", "name": "AAAAA", "dni": "70610792" }
    async createNeighbor({ dispatch }, values) {
      const result = await axios.post(`/invitation/create`, values);
      // commit('setItems', data.invitations);
      console.log("create invitation result", result);
      await dispatch("fetchNeighbor");
    }
  }
};

export default neighbor;
