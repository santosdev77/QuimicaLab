import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

export async function getElements() {
  const { data, error } = await supabase
    .from("elements")
    .select("*")
.order("atomic_number", { ascending: true });
  if (error) {
    console.error("Erro ao buscar elementos:", error);
    throw error;
  }

  return data;
}