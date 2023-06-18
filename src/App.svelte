<script lang="ts">
  // @ts-check
  import Header from "./lib/Header.svelte";
  import Item from "./lib/Item.svelte";
  import store from "./lib/supabase_store";
  import type ItemInterface from "./lib/ItemInterface";
  import { supabase } from "./lib/db";

  let name: string;
  let items: ItemInterface[] = [];

  const sort = (): void => {
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

  // Recover items from store.
  store.subscribe((storedItems) => {
    items = storedItems;
    sort();
  });

  const subscription = supabase
    .channel("any")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "*",
        table: "item",
      },
      (payload) => {
        console.log("Changes received!", payload);
        // TODO Do something with the changes.
        if (payload.eventType === "DELETE") {
          const index = getIndex(payload.old.id);
          if (index !== -1) {
            items.splice(getIndex(payload.old.id), 1);
            items = items;
          }
        }
        if (payload.eventType === "UPDATE") {
          const index = getIndex(payload.old.id);
          if (index !== -1) {
            // FIXME The checkbox doesn't change.
            items[index].done = payload.new.done;
          }
        }
        if (payload.eventType === "INSERT") {
          items = [
            { name: payload.new.name, done: false, id: payload.new.id },
            ...items,
          ];
        }
      }
    )
    .subscribe();
  console.log(subscription);

  const getIndex = (id: string): number => {
    return items.findIndex((item) => item.id === id);
  };

  const add = async () => {
    const index = items.findIndex((item) => item.name === name);
    if (!name || index !== -1) {
      return;
    }
    const id = self.crypto.randomUUID();
    const { data, error } = await supabase
      .from("item")
      .insert([{ id: id, name: name }]);
    if (error) {
      console.log(error);
      return;
    }
    items = [{ name, done: false, id: id }, ...items];
    name = "";
  };

  const remove = async (id: string) => {
    const { data, error } = await supabase
      .from("item")
      .delete()
      .match({ id: id });
    if (error) {
      console.log(error);
      return;
    }
    items.splice(getIndex(id), 1);
    items = items;
  };

  const setDone = async (id: string) => {
    const index = getIndex(id);
    const item = items[index];
    const { data, error } = await supabase
      .from("item")
      .update({ done: !item.done })
      .match({ id: id });
    if (error) {
      console.log(error);
      return;
    }
    item.done = !item.done;
    sort();
    items = items;
  };

  const removeHandler = (event: CustomEvent): void => {
    remove(event.detail.id);
  };

  const editHandler = (event: CustomEvent): void => {
    const index = getIndex(event.detail.id);
    name = items[index].name;
    remove(event.detail.id);
    document.getElementById("name")?.focus();
  };

  const doneHandler = (event: CustomEvent) => {
    setDone(event.detail.id);
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
