<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div class="reaction-row">
    <button
      v-if="userReaction && userReaction.emotion === 'happy'"
      @click="submitReaction('happy')"
    >
      🤩 {{ emotions.happy }}
    </button>
    <button>😢 {{ emotions.sad }}</button>
    <button>😡 {{ emotions.angry }}</button>
    <button>🤔 {{ emotions.confused }}</button>
    <button>😱 {{ emotions.shocked }}</button>
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
    userReaction() {
      for (const reaction of this.reactions.values()) {
        const author = reaction.username;
        if (author === this.$store.state.username) {
          return reaction;
        }
      }
      return undefined;
    }
  },
  mounted() {},
  methods: {
    hello() {},
    async submitReaction(emotion) {
      const url = `/api/reactions/${this.freetId}/`;
      const options = {
        method: 'POST',
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
        this.$store.commit('updateReactions', res.reaction);
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
  gap: 4px;
}

button {
  margin: 0 0px;
}
</style>
