<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/max-attributes-per-line -->
<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div class="freet-container">
    <article>
      <header class="freet-info">
        <h3 class="author">@{{ freet.author }}</h3>
        <p class="time-info">
          Posted on {{ freet.dateModified }}
          <i v-if="freet.edited">(edited)</i>
        </p>
      </header>
      <div>
        <div
          v-if="isControversial && hideControversy"
          class="freet-controversial"
        >
          This Freet's content has been flagged as controversial
          <button @click="disableHideControversy">View anyways</button>
        </div>
        <div v-else>
          <div v-if="$store.state.username === freet.author" class="actions">
            <button v-if="editing" @click="submitEdit">✅ Save changes</button>
            <button v-if="editing" @click="stopEditing">
              🚫 Discard changes
            </button>
            <button v-if="!editing" @click="startEditing">✏️ Edit</button>
            <button @click="deleteFreet">🗑️ Delete</button>
          </div>
          <div v-else>
            <FollowUserButton :author="freet.author" />
          </div>
          <textarea
            v-if="editing"
            class="content"
            :value="draft"
            @input="draft = $event.target.value"
          />
          <p v-else class="freet-content">
            {{ freet.content }}
          </p>
          <section class="freet-footer">
            <ReactionRow
              :reactions="reactions[freet._id] ?? undefined"
              :freet-id="freet._id"
              :signed-in="$store.state.username !== null"
            />
            <router-link :to="{name: 'Comments', params: {freetId: freet._id}}">
              Comments
            </router-link>
          </section>
        </div>
      </div>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </article>
    <article class="options">
      <OptionsMenu :freet-id="freet._id" />
    </article>
  </div>
</template>

<script>
import FollowUserButton from '@/components/User/FollowUserButton.vue';
import ReactionRow from '@/components/Reactions/ReactionRow.vue';
import OptionsMenu from '@/components/Freet/OptionsMenu.vue';

export default {
  name: 'FreetComponent',
  components: {
    FollowUserButton,
    ReactionRow,
    OptionsMenu
  },
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
    reactions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      hideControversy: true
    };
  },
  computed: {
    isControversial() {
      const controversyWarning =
        this.$store.state.controversyWarnings[this.freet._id] ?? undefined;
      return controversyWarning ? controversyWarning.active : false;
    }
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!',
            status: 'success'
          });
        }
      };
      this.request(params);
    },
    disableHideControversy() {
      this.hideControversy = false;
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error =
          'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet-content {
}

.freet-controversial {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 0 12px 0;
  gap: 8px;
}
.freet-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.time-info {
  font-size: medium;
}

.options {
  padding: 20px;
}

.freet-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 2px solid rgb(212, 212, 212);
  border-radius: 6px;
  padding: 2px 16px;
  margin: 8px 0;
  position: relative;
}

.freet-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5vw;
}
.freet-container button,
a {
  font-size: large;
  height: 32px;
  margin: 0 4px 0 0;
  background-color: rgb(248, 248, 248);
  border-color: rgb(211, 211, 211);
  border-style: solid;
  border-radius: 4px;
  text-decoration: none;
  color: black;
  text-align: center;
  padding: 2px 10px;
}

.freet-container button:hover,
a:hover {
  background-color: rgb(255, 253, 238);
  border-color: rgb(242, 224, 177);
  cursor: pointer;
}
</style>
