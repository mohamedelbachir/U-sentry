import { useMutation, useQuery } from "react-query";
import { supabase } from "../supabase/supabaseClient";
export type alertType = {
  id: number;
  title: string;
  description: string;
};

type departementType = {
  facId: number;
  nom: string;
};

type filiereType = departementType & {
  depId: number;
};

type niveauxType = {
  nom: string;
  filiereId: number;
};
export const useFacultyList = () => {
  return useQuery({
    queryKey: ["faculty-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("facultes").select("*");
      if (error) {
        //console.log(error);
        throw new Error(error.message);
      }
      return data;
    },
  });
};
export const useFacultyListWithId = (id: number) => {
  return useQuery({
    queryKey: ["faculty-list", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facultes")
        .select("*")
        .eq("id", id);
      if (error) {
        //console.log(error);
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useDepartementList = () => {
  return useQuery({
    queryKey: ["departement-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departements").select("*");
      if (error) {
        //console.log(error);
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useFiliereList = () => {
  return useQuery({
    queryKey: ["filiere-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("filieres").select("*");
      if (error) {
        //console.log(error);
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useNiveauList = () => {
  return useQuery({
    queryKey: ["niveau-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("niveaux").select("*");
      if (error) {
        //console.log(error);
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useMutationDeleteFaculty = (id: number) => {
  return useMutation(
    async () => await supabase.from("facultes").delete().eq("id", id)
  );
};

export function useMutationCreateFaculty(value: string) {
  return useMutation(
    async () => await supabase.from("facultes").insert({ nom: value })
  );
}

export function useMutationCreateDepartement({ facId, nom }: departementType) {
  return useMutation(
    async () =>
      await supabase
        .from("departements")
        .insert({ faculte_id: facId, nom: nom })
  );
}

export function useMutationDeleteDepartement(id: number) {
  return useMutation(
    async () => await supabase.from("departements").delete().eq("id", id)
  );
}

export function useMutationCreateFiliere({ nom, depId }: filiereType) {
  return useMutation(
    async () =>
      await supabase
        .from("filieres")
        .insert({ nom: nom, departement_id: depId })
  );
}

export function useMutationDeleteFiliere(id: number) {
  return useMutation(
    async () => await supabase.from("departements").delete().eq("id", id)
  );
}

export const useMutationDeleteNiveau = (id: number) => {
  return useMutation(
    async () => await supabase.from("niveaux").delete().eq("id", id)
  );
};

export function useMutationCreateNiveau({ nom, filiereId }: niveauxType) {
  return useMutation(
    async () =>
      await supabase.from("niveaux").insert({ nom: nom, filiere_id: filiereId })
  );
}
/**
 interface User {
  name: string;
  email: string;
  username: string;
  password: string;
}
const createUser = async (user: User) => {
  // Check if username exists
  const { data: userWithUsername } = await supabase
    .from('users')
    .select('*')
    .eq('username', user.username)
    .single()

  if(userWithUsername) {
    throw new Error('User with username exists')
  }

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: user.email,
    password: user.password
  })

  if(signUpError) {
    throw signUpError
  }

  return data
}

export default function useCreateUser(user: User) {
  return useMutation(() => createUser(user), {
    onSuccess: async(data) => {
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert({
          name: user.name,
          username: user.username,
          id: data.user.id
        })

      if(insertError) {
        throw insertError
      }

      return insertData
    }
  })
}
*/
