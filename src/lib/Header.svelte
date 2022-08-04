<script lang="ts">
  import "@fontsource/water-brush";
  const headerColor: string = Math.floor(Math.random() * 16777215).toString(16);
  const backgroundColor: string = Math.floor(Math.random() * 16777215).toString(
    16
  );
</script>

<header>
  <h1 style="color: #{headerColor}; background-color: #{backgroundColor}">
    Svanz List
  </h1>
</header>

<style>
  h1 {
    font-size: 4rem;
    margin: 0;
    padding: 1.5rem;
    font-family: Water Brush, sans-serif;
  }
</style>
