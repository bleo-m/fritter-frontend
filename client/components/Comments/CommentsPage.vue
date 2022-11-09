<!-- eslint-disable vue/max-attributes-per-line -->
<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="viewport">
    <section>
      <header>
        <h2>Comments Section</h2>
      </header>
      <FreetComponent
        v-if="freet !== undefined"
        :freet="freet"
        :reactions="reactions"
      />
    </section>
    <section v-if="$store.state.username">
      <CreateCommentForm :freet-id="$route.params.freetId" />
    </section>
    <section v-if="$store.state.freets.length">
      <CommentComponent
        v-for="comment in comments"
        :key="comment._id"
        :comment="comment"
      />
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateCommentForm from '@/components/Comments/CreateCommentsForm.vue';
import CommentComponent from '@/components/Comments/CommentComponent.vue';

export default {
  name: 'CommentsPage',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    FreetComponent,
    CreateCommentForm,
    CommentComponent
  },
  props: {},

  data() {
    return {};
  },
  computed: {
    freet() {
      for (const freet of this.$store.state.freets) {
        if (this.$route.params.freetId === freet._id) {
          return freet;
        }
      }
      return undefined;
    },

    reactions() {
      return this.$store.state.reactions ?? undefined;
    },
    comments() {
      return this.$store.state.comments ?? [];
    }
  },
  created() {
    if (this.freet !== undefined) {
      this.$store.commit('setComments', this.$route.params.freetId);
    }
  }
};
</script>

<style>
.viewport {
  margin: auto;
  width: 50%;
}
</style>
