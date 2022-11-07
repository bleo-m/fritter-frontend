<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div>
    <div v-if="isOpen" class="optionsMenu">
      <button>Report As Controversial</button>
      <button @click="closeMenu">Close Menu</button>
    </div>
    <button @click="openMenu">...</button>
  </div>
</template>

<script>
export default {
  name: 'OptionsButton',
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    /**
     * Update the displayed freets to either be only freets from users you are following or from all the users on Fritter
     */
    async submit() {},

    openMenu() {
      this.isOpen = true;
    },
    closeMenu() {
      this.isOpen = false;
    }
  }
};
</script>
<style scoped>
button {
  position: relative;
}

.optionsMenu {
  display: flex;
  flex-direction: column;
  gap: 16px;
  top: 75px;
  background-color: rgb(236, 236, 236);
  border-radius: 4px;
  position: absolute;
  z-index: 1;
  padding: 16px 4px;
}
</style>
