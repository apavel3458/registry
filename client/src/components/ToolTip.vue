<template>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <slot v-on="on">asdf</slot>
      </template>
      <span>asdfasdf</span>
    </v-tooltip>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    aaa: {

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
