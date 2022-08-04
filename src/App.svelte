<script lang="ts">
  // @ts-check
  import Header from "./lib/Header.svelte";
  import Item from "./lib/Item.svelte";
  import store from "./lib/store";
  import type ItemInterface from "./lib/ItemInterface";

  let name: string;
  let items: ItemInterface[] = [];

  // Recover items from local storage.
  store.subscribe((storedItems) => {
    items = storedItems;
  });

  // Reactively store the items when they change.
  $: store.set(items);

  const getIndex = (name: string): number => {
    return items.findIndex((item) => item.name === name);
  };

  const sort = (items: ItemInterface[], lastIndex: number): void => {
    items.sort((a, b) => {
      if (a.done < b.done) {
        return -1;
      }
      if (a.done > b.done) {
        return 1;
      }
      return 0;
    });
  };

  const add = (): void => {
    const index = items.findIndex((item) => item.name === name);
    if (name && index === -1) {
      items = [...items, { name, done: false, id: self.crypto.randomUUID() }];
      name = "";
    }
  };

  const remove = (index: number): void => {
    items.splice(index, 1);
    items = items;
  };

  const removeHandler = (event: CustomEvent): void => {
    remove(getIndex(event.detail.name));
  };

  const editHandler = (event: CustomEvent): void => {
    const index = getIndex(event.detail.name);
    name = items[index].name;
    remove(index);
    document.getElementById("name")?.focus();
  };

  const doneHandler = (event: CustomEvent) => {
    const index = getIndex(event.detail.name);
    const item = items[index];
    item.done = !item.done;
    sort(items, index);
    items = items;
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
    {#each items as item (item.name)}
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
