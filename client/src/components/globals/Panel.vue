<template>
  <div class="elevation-2">
      <v-toolbar flat dense dark :class="barColour" height="35">
        <v-toolbar-title :class="{'alignCenter':alignCenter}">{{title}}</v-toolbar-title>
      </v-toolbar>
      <div class="pl-4 pr-4 pt-2 pb-2">
        <slot>
          No content
        </slot>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: null,
      default: ''
    },
    alignCenter: {
      Boolean,
      default: false
    },
    barColour: {
      type: String,
      default: 'blue'
    }
  }

}
</script>

<style scoped>
.alignCenter {
  margin-right: auto;
  margin-left: auto;
}

</style>
