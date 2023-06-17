<script lang="ts">
  // @ts-check
  import { createEventDispatcher } from "svelte";
  import type ItemInterface from "./ItemInterface";

  const dispatch = createEventDispatcher();

  export let filtered: string;
  export let item: ItemInterface;

  const edit = (name: string): any => {
    dispatch("edit", { name });
  };
  const remove = (name: string): any => {
    dispatch("remove", { name });
  };
  const done = (name: string): any => {
    dispatch("done", { name });
  };
  const checked = item?.done;
</script>

<li class={filtered}>
  <span>
    <button
      on:click={() => edit(item.name)}
      class="edit"
      id="{item.name}_edit"
      tabindex="0">📝</button
    >
    <input
      {checked}
      on:change={() => done(item.name)}
      type="checkbox"
      name="done"
      id="{item.name}_done"
    />
    <label for="{item.name}_done" class:checked={item.done}>{item.name}</label>
  </span>
  <button
    on:click={() => remove(item.name)}
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
