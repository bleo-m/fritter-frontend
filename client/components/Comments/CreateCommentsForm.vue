<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateCommentForm',
  mixins: [BlockForm],
  props: {
    freetId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      url: `/api/comments/${this.freetId}`,
      method: 'POST',
      hasBody: true,
      fields: [{id: 'content', label: 'Content', value: ''}],
      title: 'Create a comment',
      refreshComments: this.freetId,
      callback: () => {
        const message = 'Successfully created a comment!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 1000);
      }
    };
  }
};
</script>
