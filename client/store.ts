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
    reactions: Object.create(null), // All reactions created in the app
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
    setReactions(state, reactions) {
      /**
       * Set the stored reactions to the provided reactions.
       * @param reactions - Reactions to store
       */
      const newReactions = Object.create(null);
      // Group reactions by their corresponding freet Ids
      for (const reaction of reactions) {
        const freetId = `${reaction.freetId}`;
        if (freetId in newReactions) {
          newReactions[freetId].push(reaction);
        } else {
          newReactions[freetId] = [reaction];
        }
      }
      state.reactions = newReactions;
    },

    addReaction(state, reaction) {
      /**
       * Add the given reaction to the stored reactions.
       * @param reaction - Reaction to store
       */
      const newReactions = JSON.parse(JSON.stringify(state.reactions)); // Copy to ensure no alliasing occurs;
      const freetId = reaction.freetId;
      if (freetId in newReactions) {
        newReactions[freetId].push(reaction);
      } else {
        newReactions[freetId] = new Array(reaction);
      }
      state.reactions = newReactions;
    },

    removeReaction(state, reaction) {
      /**
       * Remove the given reaction from the stored reactions.
       * @param reaction - Reaction to store
       */
      const newReactions = JSON.parse(JSON.stringify(state.reactions)); // Copy to ensure no alliasing occurs;
      const freetId = reaction.freetId;
      if (freetId in newReactions) {
        const freetReactions = newReactions[freetId];
        const cleansedReactions = freetReactions.filter(
          (freetReaction) => freetReaction._id !== reaction._id
        );
        newReactions[freetId] = cleansedReactions;
      }
      state.reactions = newReactions;
    },

    updateReaction(state, reaction) {
      /**
       * Update an exisiting user's reaction to a freetId.
       * @param reaction - The new Reaction to store
       */
      const newReactions = JSON.parse(JSON.stringify(state.reactions)); // Copy to ensure no alliasing occurs;
      const freetId = reaction.freetId;
      const author = reaction.username;
      if (freetId in newReactions) {
        const freetReactions = newReactions[freetId];
        // Search for reaction with a matching FreetId and has the given author
        for (let i = 0; i < freetReactions.length; i++) {
          if (freetReactions[i].username === author) {
            freetReactions[i] = reaction; // replace old reaction with new reaction
          }
        }
      } else {
        newReactions[freetId] = new Array(reaction);
      }
      state.reactions = newReactions;
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
