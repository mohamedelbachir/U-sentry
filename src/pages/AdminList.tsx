import {
  Group,
  Title,
  Text,
  Button,
  Modal,
  TextInput,
  PasswordInput,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import {
  useAdminList,
  useFacultyList,
  useMutationCreateAdmin,
  useMutationDeleteAdmin,
} from "../hooks/api";
import AdminListTable from "../components/AdminListTable.component";
import { useQueryClient } from "react-query";

function AdminList() {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idFac, setFacId] = useState<number | null>(null);
  const { data: facList = [] } = useFacultyList();
  const { data = [], isLoading, error: fetchError } = useAdminList();
  const queryClient = useQueryClient();
  const [id, setId] = useState<number | null>(null);
  const [select, setSelectData] = useState<{ id: number; auth: string }>({});
  const deleteAdmin = useMutationDeleteAdmin(select);
  const create = useMutationCreateAdmin({
    name: name,
    email: email,
    mdp: password,
    role: idFac!,
  });
  useEffect(() => {
    if (id != null) {
      deleteAdmin.mutate();
    }
  }, [id]);
  useEffect(() => {
    if (create.isSuccess) {
      close();
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["admin-list"] });
    }
  }, [create.isSuccess]);
  useEffect(() => {
    if (deleteAdmin.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["admin-list"] });
    }
  }, [deleteAdmin.isSuccess]);
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    create.mutate();
  };
  const handleDelete = ({ id, auth }: { id: number; auth: string }) => {
    setId(id);
    setSelectData({ id, auth });
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => (loading ? undefined : close())}
        title="Ajouter un nouveau admin"
        centered
        closeOnClickOutside={false}
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Nom de l'admin"
            placeholder="nom"
            onChange={(e) => setName(e.target.value)}
            withAsterisk
            required
            error={isError}
          />
          <TextInput
            label="Son email"
            placeholder="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            withAsterisk
            required
            error={isError}
          />
          <PasswordInput
            label="Son mot de passe"
            placeholder="mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            withAsterisk
            required
            error={isError}
          />
          <Select
            label="Choisir sa faculte de publication"
            placeholder="choisir une faculte"
            onChange={(e) => setFacId(parseInt(e!))}
            data={[
              ...facList.map((item) => ({
                label: item.nom,
                value: `${item.id}`,
              })),
            ]}
            searchable
            nothingFoundMessage="Pas de faculte ..."
            withAsterisk
            required
          />
          <Button fullWidth mt={"xs"} type="submit" loading={create.isLoading}>
            Ajouter
          </Button>
        </form>
      </Modal>
      <Group justify="space-between">
        <Title order={2}>Gerer vos admin</Title>
      </Group>
      <Group mt={"md"} justify="space-between">
        <Text size="lg">Liste de vos admin!</Text>
        <Button onClick={open}>Ajouter un admin</Button>
      </Group>
      <AdminListTable
        data={data}
        isLoading={isLoading}
        index={id}
        handleClick={handleDelete}
      />
    </>
  );
}

export default AdminList;
