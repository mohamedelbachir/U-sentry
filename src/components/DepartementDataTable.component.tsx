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
  useMutationCreateDepartement,
  useMutationDeleteDepartement,
} from "../hooks/api";

function DepartementDataTable() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: facList = [] } = useFacultyList();
  const { data = [], isLoading: fetchData, error } = useDepartementList();
  const [loading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [idFac, setFacId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const create = useMutationCreateDepartement({ facId: idFac!, nom: name });
  const deleteDepartement = useMutationDeleteDepartement(id!);

  useEffect(() => {
    setError(create.isError);
  }, [create.isError]);

  useEffect(() => {
    if (create.isSuccess) {
      close();
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["departement-list"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [create.isSuccess]);

  useEffect(() => {
    if (id != null) {
      deleteDepartement.mutate();
    }
  }, [id]);

  useEffect(() => {
    if (deleteDepartement.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["departement-list"] });
      queryClient.invalidateQueries({ queryKey: ["filiere-list"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteDepartement.isSuccess]);

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
        title="Ajouter une nouveau departement"
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
            nothingFoundMessage="Pas de faculte ..."
            withAsterisk
            required
          />
          <TextInput
            label="Nom du departement"
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
        <Text size="lg">Liste departements</Text>

        <Button onClick={open} disabled={facList.length == 0}>
          Ajouter un departement
        </Button>
      </Group>
      <DataTable
        data={data}
        isLoading={fetchData}
        handleClick={handleDelete}
        index={id}
        isError={deleteDepartement.isError}
      />
      {error && data.length == 0 && <Center>erreur de chargement ...</Center>}
    </>
  );
}

export default DepartementDataTable;
