// @ts-check
import { writable } from "svelte/store";
import { supabase } from "./db";

const { data, error } = await supabase.from('item').select();
if (error) {
    console.log(error);
}

// Why doesn't this work?
// The channel state is immediately 'closed'.
// const subscription = supabase.channel('any')
//     .on(
//         'postgres_changes',
//         {
//             event: '*',
//             schema: '*',
//             table: 'item'
//         },
//         (payload) => {
//             console.log('Changes received!', payload);
//         }
//     ).subscribe();
// console.log(subscription);

const store = writable(data);
store.subscribe(() => {});

export default store;