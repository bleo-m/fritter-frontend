<!-- eslint-disable vue/max-attributes-per-line -->
<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <article>
    <section class="comment-container">
      <h4>{{ comment.author }}</h4>
      <p>{{ comment.content }}</p>
    </section>
  </article>
</template>

<script>
export default {
  name: 'CommentComponent',
  props: {comment: {type: Object, required: true}},
  data() {
    return {};
  },
  computed: {}
};
</script>
<style>
.comment-container {
  border-style: solid;
  border-color: rgb(153, 153, 153);
  border-width: 1px;
  border-radius: 8px;
  padding: 0 8px;
  margin-top: 8px;
}
.comment-content {
}
</style>
