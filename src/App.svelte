<script lang="ts">
  // @ts-check
  import Header from "./lib/Header.svelte";
  import Item from "./lib/Item.svelte";
  import store from "./lib/store";

  let name: string;

  const add = (): void => {
    if (store.add(name)) {
      name = "";
    }
  };

  const removeHandler = (event: CustomEvent): void => {
    store.remove(event.detail.name);
  };

  const editHandler = (event: CustomEvent): void => {
    name = event.detail.name;
    store.remove(event.detail.name);
    document.getElementById("name")?.focus();
  };

  const doneHandler = (event: CustomEvent) => {
    store.toggleDone(event.detail.name)
  };

  const filter = (item: { name: string }, name: string) =>
    !name || item.name.includes(name) ? "" : "filtered";

  const clear = () => {
    name = "";
  };
</script>

<Header />
<main>
  <form on:submit|preventDefault={add}>
    <input type="button" on:click={clear} value="clear" />
    <input bind:value={name} type="text" name="name" id="name" />
    <input type="submit" value="add" />
  </form>
  <ul>
    {#each $store as item (item.name)}
      <Item
        filtered={filter(item, name)}
        {item}
        on:edit={editHandler}
        on:remove={removeHandler}
        on:done={doneHandler}
      />
    {/each}
  </ul>
</main>

<style>
  form {
    margin-top: 1em;
    display: flex;
    justify-content: space-between;
  }

  #name {
    width: 100%;
    margin: 0 1em;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  main {
    max-width: 500px;
    margin: 0 auto;
  }
</style>
