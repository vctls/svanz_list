// @ts-check
import { writable } from "svelte/store"
import { supabase } from "./db"

function createStore() {
    const { subscribe, set } = writable([])

    return {
        subscribe,
        init: async () => {
            const { data, error } = await supabase.from('item').select()
            if (error) {
                console.log(error)
            }
            set(data)
        }
    }
}

export const store = createStore()