import { Nation } from "@/components/groups/groups.types";
import { getNationById } from "@/lib/db/nations";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

const fetchNations = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("nations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Nation[];
};

const fetchNation = async (nationId: string): Promise<Nation> => {
  const supabase = createClient();
  const result = await getNationById(supabase, nationId);
  return result as Nation;
};



export const useNations = () => {
  const { data, error, isLoading, mutate } = useSWR<Nation[]>(
    "nations",
    fetchNations
  );

  return {
    nations: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useNation = (nationId: string) => {
  const { data, error, isLoading, mutate } = useSWR<Nation>(
    nationId || null,
    fetchNation
  );






  return {
    nation: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useCreateNation = () => {
  const createNation = async (
    name: string,
    description: string,
    ownerId: string
  ) => {
    const supabase = createClient() as SupabaseClient<Database>;
    const { data, error } = await supabase.rpc("create_nation", {
      p_name: name,
      p_description: description,
      p_owner_id: ownerId,
    });
    if (error) throw error;
    return data; // Returns nation_id
  };
  return { createNation };
};
