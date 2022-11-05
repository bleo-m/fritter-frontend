<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div>
    <button v-if="followOnly" @click="unsetfollowOnly">
      See Freets From All Users
    </button>
    <button v-else @click="setfollowOnly">
      Only See Freets From Users I Follow
    </button>
  </div>
</template>

<script>
export default {
  name: 'FollowingFreetsButton',
  data() {
    return {followOnly: this.$store.state.followOnly};
  },
  methods: {
    /**
     * Update the displayed freets to either be only freets from users you are following or from all the users on Fritter
     */
    async submit() {
      const url = this.followOnly
        ? `/api/freets/following-only`
        : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit(
          'updateFilter',
          this.followOnly ? '/following-only' : ''
        );
        this.$store.commit('updateFreets', res);
      } catch (e) {
        if (this.value === this.$store.state.filter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateFilter', null);
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshFreets');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.filter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    /**
     * Enable Follow Only Mode
     */
    setfollowOnly() {
      this.followOnly = true;
      this.$store.commit('updateFollowOnly', this.followOnly);
      this.submit();
    },

    /**
     * Disable Follow Only Mode
     */
    unsetfollowOnly() {
      this.followOnly = false;
      this.$store.commit('updateFollowOnly', this.followOnly);
      this.submit();
    }
  }
};
</script>
<style scoped>
button {
  margin: 0 8px;
}
</style>
