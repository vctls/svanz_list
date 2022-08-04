// @ts-check
import { writable } from "svelte/store";

const storedItems = localStorage.getItem("items");
const store = writable(storedItems ? JSON.parse(storedItems) : []);
store.subscribe(items => localStorage.setItem("items", JSON.stringify(items)));

export default store;