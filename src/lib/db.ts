import { createClient } from "@supabase/supabase-js";
import type { Database } from "./schema";

const url = localStorage.getItem('url');
const key = localStorage.getItem('key');

export const supabase = createClient<Database>(url, key);