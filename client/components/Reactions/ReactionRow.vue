<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div class="reaction-row">
    <div v-if="signedIn">
      <button
        v-if="userReaction && userReaction.emotion === 'happy'"
        class="current-reaction"
        @click="removeReaction('happy')"
      >
        🤩 {{ emotions.happy }}
      </button>
      <button v-else @click="submitReaction('happy')">
        🤩 {{ emotions.happy }}
      </button>

      <button
        v-if="userReaction && userReaction.emotion === 'sad'"
        class="current-reaction"
        @click="removeReaction('sad')"
      >
        😢 {{ emotions.sad }}
      </button>
      <button v-else @click="submitReaction('sad')">
        😢 {{ emotions.sad }}
      </button>

      <button
        v-if="userReaction && userReaction.emotion === 'angry'"
        class="current-reaction"
        @click="removeReaction('angry')"
      >
        😡 {{ emotions.angry }}
      </button>
      <button v-else @click="submitReaction('angry')">
        😡 {{ emotions.angry }}
      </button>

      <button
        v-if="userReaction && userReaction.emotion === 'confused'"
        class="current-reaction"
        @click="removeReaction('confused')"
      >
        🤔 {{ emotions.confused }}
      </button>
      <button v-else @click="submitReaction('confused')">
        🤔 {{ emotions.confused }}
      </button>

      <button
        v-if="userReaction && userReaction.emotion === 'shocked'"
        class="current-reaction"
        @click="removeReaction('shocked')"
      >
        😱 {{ emotions.shocked }}
      </button>
      <button v-else @click="submitReaction('shocked')">
        😱 {{ emotions.shocked }}
      </button>
    </div>
    <div v-else>
      <button>🤩 {{ emotions.happy }}</button>
      <button>😢 {{ emotions.sad }}</button>
      <button>😡 {{ emotions.angry }}</button>
      <button>🤔 {{ emotions.confused }}</button>
      <button>😱 {{ emotions.shocked }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReactionRow',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    reactions: {
      required: true
    },
    freetId: {
      type: String,
      required: true
    },
    signedIn: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    /**
     * Calculates the number of emotions for the passed down freet, if there is any
     */
    emotions() {
      let newEmotions = {happy: 0, sad: 0, angry: 0, confused: 0, shocked: 0};
      if (this.reactions !== undefined && this.reactions.values) {
        for (const reaction of this.reactions.values()) {
          const emotion = reaction.emotion;
          newEmotions[emotion] += 1;
        }
        return newEmotions;
      } else {
        return newEmotions;
      }
    },
    /**
     * Gets user's reaction of the passed down freet, if there is any
     */
    userReaction() {
      if (this.reactions !== undefined && this.reactions.values) {
        for (const reaction of this.reactions.values()) {
          const author = reaction.username;
          if (author === this.$store.state.username) {
            return reaction;
          }
        }
        return null;
      } else {
        return null;
      }
    }
  },
  mounted() {},
  methods: {
    async submitReaction(emotion) {
      const url = `/api/reactions/${this.freetId}/`;
      const options = {
        method: this.userReaction === null ? 'POST' : 'PUT', // POST if user has no previous reaction
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      options.body = JSON.stringify({emotion: emotion});

      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        // Update Reactions state depending on POST or PUT request
        options.method === 'POST'
          ? this.$store.commit('addReaction', res.reaction)
          : this.$store.commit('updateReaction', res.reaction);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    async removeReaction(emotion) {
      const url = `/api/reactions/${this.freetId}/`;
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      options.body = JSON.stringify({emotion: emotion});

      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('removeReaction', this.userReaction);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
<style scoped>
.reaction-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 16px 0;
}

.current-reaction {
  background-color: rgba(255, 225, 143, 0.298);
  border-color: rgb(249, 197, 54);
}
button {
  font-size: large;
  height: 32px;
  width: 64px;
  margin: 0 4px 0 0;
  background-color: rgb(248, 248, 248);
  border-color: rgb(211, 211, 211);
  border-style: solid;
  border-radius: 4px;
}
button:hover {
  background-color: rgb(255, 253, 238);
  border-color: rgb(242, 224, 177);
  cursor: pointer;
}
</style>
