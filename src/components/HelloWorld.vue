<template>
  <div class="hello">
    <h1>
      Welcome to Your Vue.js App
    </h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a
        href="https://cli.vuejs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        vue-cli documentation
      </a>.
    </p>
    <h3>
      Here are some links:
    </h3>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official Vue.js Documentation
        </a>
      </li>
      <li>
        <a
          href="https://router.vuejs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vue Router Documentation
        </a>
      </li>
      <li>
        <a
          href="https://vuex.vuejs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vuex Documentation
        </a>
      </li>
    </ul>
    <h3>
      Input Fields Example:
    </h3>
    <div>
      <label
        for="exampleInput"
        
        class="input-label"
      >
        Example Input:
      </label>
      <input
        id="exampleInput"
        v-model="exampleValue"
        type="text"
        class="input-field"
        aria-label="Example Input"
        style="width: 200px;"
      >
    </div>
    <!-- Add more elements as needed -->
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  
  props: {
    msg: {
      type: String,
      required: true,
      default: '',
    },
  },

  data() {
    return {
      exampleValue: '',
    }
  },
}
</script>

<style scoped>
/* Your styles here */


.input-label {
  display: block;
  margin-bottom: 5px;
}

.input-field {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
