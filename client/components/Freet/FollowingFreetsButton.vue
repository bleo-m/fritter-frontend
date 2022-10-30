<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div>
    <button v-if="following">See All Freets</button>
    <button v-else>Only See Freets From Users I Follow</button>
  </div>
</template>

<script>
export default {
  name: 'FollowingFreetsButton',
  props: {following: {type: Boolean, required: true}},
  data() {
    return {};
  },
  methods: {
    async submit() {
      const url = this.following ? `/api/freets/following-only` : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateFilter', this.value);
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
    }
  }
};
</script>
<style scoped>
button {
  margin: 0 8px;
}
</style>
