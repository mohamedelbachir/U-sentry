import {
  Group,
  Button,
  Text,
  Center,
  Modal,
  TextInput,
  Select,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import DataTable from "./DataTable.component.";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "react-query";
import {
  useDepartementList,
  useFacultyList,
  useFiliereList,
  useMutationCreateFiliere,
  useMutationDeleteFiliere,
} from "../hooks/api";

function FiliereDataTable() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: facList = [] } = useFacultyList();
  const { data = [], isLoading: fetchData, error } = useFiliereList();
  const { data: depList = [] } = useDepartementList();
  const [loading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [idFac, setFacId] = useState<number | null>(null);
  const [idDep, setDepId] = useState<number | null>(null);
  const [dep, setDep] = useState<
    {
      faculte_id: number;
      id: number;
      nom: string;
    }[]
  >([]);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const create = useMutationCreateFiliere({
    facId: idFac!,
    nom: name,
    depId: idDep!,
  });
  const deleteFiliere = useMutationDeleteFiliere(id!);

  useEffect(() => {
    setError(create.isError);
  }, [create.isError]);

  useEffect(() => {
    if (create.isSuccess) {
      close();
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["filiere-list"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [create.isSuccess]);

  useEffect(() => {
    if (id != null) {
      deleteFiliere.mutate();
    }
  }, [id]);

  useEffect(() => {
    if (deleteFiliere.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["departement-list"] });
      queryClient.invalidateQueries({ queryKey: ["niveau-list"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFiliere.isSuccess]);

  const handleDelete = (id: number) => {
    setId(id);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    create.mutate();
  };
  useEffect(() => {
    const l = depList.filter((d) => d.faculte_id == idFac);
    setDep(l);
  }, [idFac]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => (loading ? undefined : close())}
        title="Ajouter une nouvelle filiere"
        centered
        closeOnClickOutside={false}
      >
        <form onSubmit={handleSubmit}>
          <Select
            label="Choisir la faculte"
            placeholder="choisir une faculte"
            onChange={(e) => setFacId(parseInt(e!))}
            data={[
              ...facList.map((item) => ({
                label: item.nom,
                value: `${item.id}`,
              })),
            ]}
            searchable
            nothingFoundMessage="Pas de filiere ..."
            withAsterisk
            allowDeselect={false}
            required
          />
          <Select
            label="Choisir le departement"
            placeholder="choisir un departement"
            onChange={(e) => setDepId(parseInt(e!))}
            data={[
              ...dep.map((item) => ({
                label: item.nom,
                value: `${item.id}`,
              })),
            ]}
            searchable
            nothingFoundMessage="Pas de departement ..."
            allowDeselect={false}
            withAsterisk
            required
          />
          <TextInput
            label="Nom de la filiere"
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
        <Text size="lg">Liste de filieres</Text>

        <Button onClick={open} disabled={depList.length == 0}>
          Ajouter une filiere
        </Button>
      </Group>
      <DataTable
        data={data}
        isLoading={fetchData}
        handleClick={handleDelete}
        index={id}
        isError={deleteFiliere.isError}
      />
      {error && data.length == 0 && <Center>erreur de chargement ...</Center>}
    </>
  );
}

export default FiliereDataTable;
