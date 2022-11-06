import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various componentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    followOnly: false, // If only freets from the user's following list show up on the timeline
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    followers: [], // Users that follow the logged in user
    following: [], // Users that the logged in user is following
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setFollowersAndFollowing(state, {followers, following}) {
      /**
       * Update the stored user to the specified one.
       * @param user - new user to set
       */
      state.followers = followers;
      state.following = following;
    },
    updateFollowing(state, following) {
      /**
       * Update the stored user to the specified one.
       * @param user - new user to set
       */
      state.following = following;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFollowOnly(state, followOnly) {
      /**
       * Update the status of follow only mode
       * @param followOnly - if followOnly is on/off
       */
      state.followOnly = followOnly;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter
        ? `/api/users/${state.filter}/freets`
        : '/api/freets';
      const res = await fetch(url).then(async (r) => r.json());
      state.freets = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
