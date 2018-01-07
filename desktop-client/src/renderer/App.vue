<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'skcube-client'
  }
</script>

<style lang="sass">
  html
    height: 100%;

  body
    min-height: 100%;
    background: radial-gradient( ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, .9) 100%);

</style>
