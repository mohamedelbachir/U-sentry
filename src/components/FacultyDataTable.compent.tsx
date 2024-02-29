import { Group, Button, Text, Modal, TextInput, Center } from "@mantine/core";
import { useQueryClient } from "react-query";
import DataTable from "./DataTable.component.";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  useFacultyList,
  useMutationCreateFaculty,
  useMutationDeleteFaculty,
} from "../hooks/api";

function FacultyDataTable() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data = [], isLoading: fetchData, error } = useFacultyList();
  const [loading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const create = useMutationCreateFaculty(name);
  const deleteFaculty = useMutationDeleteFaculty(id!);
  const queryClient = useQueryClient();
  useEffect(() => {
    setError(create.isError);
  }, [create.isError]);

  useEffect(() => {
    if (create.isSuccess) {
      close();
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["faculty-list"] });
    }
  }, [create.isSuccess]);

  useEffect(() => {
    if (id != null) {
      deleteFaculty.mutate();
    }
  }, [id]);

  useEffect(() => {
    if (deleteFaculty.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["faculty-list"] });
      queryClient.invalidateQueries({ queryKey: ["departement-list"] });
      queryClient.invalidateQueries({ queryKey: ["filiere-list"] });
      queryClient.invalidateQueries({ queryKey: ["niveau-list"] });
    }
  }, [deleteFaculty.isSuccess]);

  const handleDelete = (id: number) => {
    setId(id);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    create.mutate();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => (loading ? undefined : close())}
        title="Ajouter une nouvelle faculte"
        centered
        closeOnClickOutside={false}
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Nom de la faculte"
            placeholder="nom"
            onChange={(e) => setName(e.target.value)}
            withAsterisk
            required
            error={isError}
          />
          <Button fullWidth mt={"xs"} type="submit" loading={create.isLoading}>
            Ajouter
          </Button>
        </form>
      </Modal>
      <Group mt={"md"} justify="space-between">
        <Text size="lg">Liste de faculte</Text>
        <Button onClick={open}>Ajouter une faculte</Button>
      </Group>
      <DataTable
        data={data}
        isLoading={fetchData}
        handleClick={handleDelete}
        index={id}
        isError={deleteFaculty.isError}
      />
      {error && data.length == 0 && <Center>erreur de chargement ...</Center>}
    </>
  );
}

export default FacultyDataTable;
