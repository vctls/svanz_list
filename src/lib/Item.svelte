<script lang="ts">
  // @ts-check
  import { createEventDispatcher } from "svelte";
  import type ItemInterface from "./ItemInterface";

  const dispatch = createEventDispatcher();

  export let filtered: string;
  export let item: ItemInterface;

  const edit = (id: string): any => {
    dispatch("edit", { id: id });
  };
  const remove = (id: string): any => {
    dispatch("remove", { id: id });
  };
  const done = (id: string): any => {
    dispatch("done", { id: id });
  };
  const checked = item?.done;
</script>

<li id={item.id} class={filtered}>
  <span>
    <button
      on:click={() => edit(item.id)}
      class="edit"
      id="{item.name}_edit"
      tabindex="0">📝</button
    >
    <input
      {checked}
      on:change={() => done(item.id)}
      type="checkbox"
      name="done"
      id="{item.name}_done"
    />
    <label for="{item.name}_done" class:checked={item.done}>{item.name}</label>
  </span>
  <button
    on:click={() => remove(item.id)}
    class="delete"
    id="{item.name}_delete"
    tabindex="0">❌</button
  >
</li>

<style>
  .checked {
    text-decoration: line-through;
  }

  .filtered {
    display: none;
  }

  li {
    display: flex;
    justify-content: space-between;
  }

  label {
    width: 100%;
  }
</style>
