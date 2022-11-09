<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div>
    <button v-if="isFollowingUser" @click="removeFollow">Following ✅</button>
    <button v-else @click="setFollow">Follow</button>
  </div>
</template>

<script>
export default {
  name: 'FollowUserButton',
  props: {
    author: {
      type: String,
      required: true
    }
  },
  computed: {
    isFollowingUser() {
      return this.$store.state.following.includes(this.author);
    }
  },
  methods: {
    async submitFollow() {
      const url = `/api/users/${this.author}/followers`;
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      options.body = JSON.stringify({user: this.author});
      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateFollowing', [
          ...this.$store.state.following,
          this.author
        ]);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async submitRemoveFollow() {
      const url = `/api/users/${this.author}/followers`;
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      options.body = JSON.stringify({user: this.author});
      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        // remove follower from state machine
        this.$store.commit(
          'updateFollowing',
          this.$store.state.following.filter((name) => name !== this.author)
        );
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    /**
     * Enable Follow Only Mode
     */
    setFollow() {
      this.submitFollow();
    },

    /**
     * Disable Follow Only Mode
     */
    removeFollow() {
      this.submitRemoveFollow();
    }
  }
};
</script>
<style scoped>
button {
  padding: 4px 16px;
  background-color: rgb(248, 248, 248);
  border-color: rgb(211, 211, 211);
  border-style: solid;
  border-radius: 4px;
  margin: 0;
}
button:hover {
  background-color: rgb(255, 253, 238);
  border-color: rgb(242, 224, 177);
  cursor: pointer;
}
</style>
