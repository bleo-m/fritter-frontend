<!-- Default page that also displays freets -->

<template>
  <main class="viewport">
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login"> Sign in </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="freet-page-header">
          <h2>
            Viewing all freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
          <div>
            <div v-if="$store.state.username">
              <FollowingFreetsButton ref="followingFreetsButton" />
            </div>
          </div>
        </div>
      </header>
      <section v-if="$store.state.freets.length">
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
          :reactions="$store.state.reactions"
        />
      </section>
      <article v-else>
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import FollowingFreetsButton from '@/components/Freet/FollowingFreetsButton.vue';

export default {
  name: 'FreetPage',
  components: {
    FreetComponent,
    // eslint-disable-next-line vue/no-unused-components
    GetFreetsForm,
    CreateFreetForm,
    FollowingFreetsButton
  },
  mounted() {
    this.$store.commit('clearComments');
    // this.logStuff();
  },
  methods: {
    logStuff() {}
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.viewport {
  margin: auto;
  width: 50%;
}

.freet-page-header {
  width: 100%;
}
</style>
