import { createClient } from "@supabase/supabase-js";
import type { Database } from "./schema";

const params = new URLSearchParams(window.location.search);;
const url = 'https://' + params.get('url');
const key = params.get('key');

export const supabase = createClient<Database>(url, key);