import { useMutation, useQuery } from "react-query";
import { supabase, adminAuthClient } from "../supabase/supabaseClient";
import { useEffect, useState } from "react";
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

type niveauxType = filiereType & {
  filiereId: number;
};

type adminProps = {
  email: string;
  mdp: string;
  role: number;
  name: string;
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
export const useFacultyListById = (id: number) => {
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

export const useAdminList = () => {
  return useQuery({
    queryKey: ["admin-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin").select("*");
      if (error) {
        //console.log(error);
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useAlertList = (id: string) => {
  return useQuery({
    queryKey: ["alert-list", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alertes")
        .select("*")
        .eq("uuid", id);
      if (error) {
        //console.log(error);
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProfileList = () => {
  return useQuery({
    queryKey: ["profile-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        //console.log(error);
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export function useMutationCreateAdmin({ name, email, mdp, role }: adminProps) {
  const [id, setId] = useState<string | undefined>(undefined);
  const updateAdminProfile = useMutationCreateAdminProfile({
    id: id!,
    role: role,
  });
  const updateProfile = useMutationUpdateProile({
    id: id!,
    name: name,
    email: email,
  });
  useEffect(() => {
    if (id) {
      updateAdminProfile.mutate();
      updateProfile.mutate();
    }
  }, [id]);

  return useMutation(
    async () =>
      await adminAuthClient
        .createUser({
          email: email,
          password: mdp,
          email_confirm: true,
        })
        .then((r) => {
          setId(r.data.user?.id);
        })
  );
}

export const useMutationDeleteFaculty = (id: number) => {
  return useMutation(
    async () => await supabase.from("facultes").delete().eq("id", id)
  );
};

export const useMutationDeleteAdmin = ({
  auth,
  id,
}: {
  auth: string;
  id: number;
}) => {
  adminAuthClient.deleteUser(auth);
  return useMutation(
    async () => await supabase.from("admin").delete().eq("id", id)
  );
};

export const useMutationDeleteAlert = (id: number) => {
  return useMutation(
    async () => await supabase.from("alertes").delete().eq("id", id)
  );
};

export const useMutationUpdateProile = ({
  id,
  name,
  email,
}: {
  id: string;
  name: string;
  email: string;
}) => {
  return useMutation(
    async () =>
      await supabase
        .from("profiles")
        .update({ username: name, email })
        .eq("id", id)
  );
};

export const useMutationCreateAdminProfile = ({
  id,
  role,
}: {
  id: string;
  role: number;
}) => {
  return useMutation(
    async () =>
      await supabase.from("admin").insert({ uuid: id, fonction: role })
  );
};

export function useMutationCreateAlert({
  uuid,
  title,
  description,
  hash,
  imageUrl,
  target,
  content,
}: {
  uuid: string;
  title: string;
  description: string;
  hash: string;
  imageUrl: string;
  content?: string;
  target?: {
    facId?: number[];
    depId?: number[];
    filiereId?: number[];
    niveauId?: number[];
  } | null;
}) {
  return useMutation(
    async () =>
      await supabase.from("alertes").insert({
        uuid,
        description,
        title,
        hash,
        imageURL: imageUrl,
        target: target,
        content,
      })
  );
}

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

export function useMutationCreateFiliere({ nom, depId, facId }: filiereType) {
  return useMutation(
    async () =>
      await supabase
        .from("filieres")
        .insert({ nom: nom, departement_id: depId, faculte_id: facId })
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

export function useMutationCreateNiveau({
  nom,
  filiereId,
  depId,
  facId,
}: niveauxType) {
  return useMutation(
    async () =>
      await supabase.from("niveaux").insert({
        nom: nom,
        filiere_id: filiereId,
        departement_id: depId,
        faculte_id: facId,
      })
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
