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
  methods: {}
};
</script>
<style scoped>
button {
  margin: 0 8px;
}
</style>
