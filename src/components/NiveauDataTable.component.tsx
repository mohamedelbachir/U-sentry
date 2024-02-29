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
  useMutationCreateNiveau,
  useMutationDeleteNiveau,
  useNiveauList,
} from "../hooks/api";

function NiveauDataTable() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: facList = [] } = useFacultyList();
  const { data = [], isLoading: fetchData, error } = useNiveauList();
  const { data: depList = [] } = useDepartementList();
  const { data: filiereList = [] } = useFiliereList();
  const [loading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [idFac, setFacId] = useState<number | null>(null);
  const [idDep, setDepId] = useState<number | null>(null);
  const [idFiliere, setFiliereId] = useState<number | null>(null);
  const [dep, setDep] = useState<
    {
      faculte_id: number;
      id: number;
      nom: string;
    }[]
  >([]);
  const [filiere, setFiliere] = useState<
    {
      departement_id: number | null;
      id: number;
      nom: string;
    }[]
  >([]);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const create = useMutationCreateNiveau({
    nom: name,
    filiereId: idFiliere!,
  });
  const deleteNiveau = useMutationDeleteNiveau(id!);

  useEffect(() => {
    setError(create.isError);
  }, [create.isError]);

  useEffect(() => {
    if (create.isSuccess) {
      close();
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["niveau-list"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [create.isSuccess]);

  useEffect(() => {
    if (id != null) {
      deleteNiveau.mutate();
    }
  }, [id]);

  useEffect(() => {
    if (deleteNiveau.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["niveau-list"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteNiveau.isSuccess]);

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

  useEffect(() => {
    const l = filiereList.filter((d) => d.departement_id == idDep);
    setFiliere(l);
  }, [idDep]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => (loading ? undefined : close())}
        title="Ajouter une nouveau filiere"
        centered
        closeOnClickOutside={false}
      >
        <form onSubmit={handleSubmit}>
          <Select
            label="Choisir le departement"
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
          <Select
            label="Choisir la filiere"
            placeholder="choisir une filiere"
            onChange={(e) => setFiliereId(parseInt(e!))}
            data={[
              ...filiere.map((item) => ({
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
            label="Nom du niveau"
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
        <Text size="lg">Liste de Niveau</Text>

        <Button onClick={open} disabled={filiereList.length == 0}>
          Ajouter un niveau
        </Button>
      </Group>
      <DataTable
        data={data}
        isLoading={fetchData}
        handleClick={handleDelete}
        index={id}
        isError={deleteNiveau.isError}
      />
      {error && data.length == 0 && <Center>erreur de chargement ...</Center>}
    </>
  );
}

export default NiveauDataTable;
