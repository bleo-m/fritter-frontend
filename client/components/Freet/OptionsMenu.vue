<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div>
    <div v-if="isOpen" class="optionsMenu">
      <button @click="submitControversy">Report As Controversial</button>
      <button @click="closeMenu">Close Menu</button>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </div>
    <button @click="openMenu">...</button>
  </div>
</template>

<script>
export default {
  name: 'OptionsButton',
  props: {
    freetId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isOpen: false,
      alerts: {}
    };
  },
  methods: {
    /**
     * Update the displayed freets to either be only freets from users you are following or from all the users on Fritter
     */
    async submitControversy() {
      const url = `/api/controversy-warnings/${this.freetId}/`;
      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };

      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateControversyWarning', res.controversyWarning);
        this.closeMenu();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

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
