// @ts-check
/*
This custom store holds the logic for handling the items.
This way we can avoid manipulating an Item array in the component and use 
Svelte's store auto-subscription instead.
 */
import { writable } from "svelte/store";
import type ItemInterface from "./ItemInterface";

const storedItems = localStorage.getItem("items");
const items: ItemInterface[] = storedItems ? JSON.parse(storedItems) : [];
const { subscribe, set, update } = writable(items);
subscribe(items => localStorage.setItem("items", JSON.stringify(items)));

const getIndex = (name: string): number => {
  return items.findIndex((item) => item.name === name);
};

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

export default {
  subscribe,
  set,
  update,
  /**
   * Adds an item to the list.
   * @param {string} name The name of the item.
   * @returns {boolean} True if the item was added, false otherwise.
   */
  add: (name: string): boolean => {
    if (name && getIndex(name) === -1) {
      set([{ name, done: false, id: self.crypto.randomUUID() }, ...items]);
      return true;
    }
    return false;
  },
  /**
   * Removes an item from the list.
   * @param {string} name The name of the item.
   */
  remove: (name: string): void => {
    items.splice(getIndex(name), 1);
    set(items);
  },
  /**
   * Toggles the done state of an item.
   * @param {string} name The name of the item.
   */
  toggleDone: (name: string): void => {
    const item = items[getIndex(name)];
    item.done = !item.done;
    sort();
    set(items);
  }
};