import { Table, Button, Text, Skeleton } from "@mantine/core";
import React from "react";
import {
  useDepartementList,
  useFacultyList,
  useFiliereList,
} from "../hooks/api";
type TableProps = {
  data: {
    id: number;
    nom: string;
    faculte_id?: number;
    departement_id?: number;
    filiere_id?: number;
  }[];
  handleClick?: (id: number) => void;
  isLoading?: boolean;
  index?: number | null;
  isError?: boolean;
};
const keyExists = (
  arr: { id: number; nom: string; faculte_id?: number | undefined }[],
  key: string
) => {
  for (const obj of arr) {
    if (key in obj) {
      return true;
    }
  }
  return false;
};
function DataTable({
  data,
  handleClick,
  isLoading,
  index,
  isError,
}: TableProps) {
  const falcultyProps = keyExists(data, "faculte_id");
  const departementProps = keyExists(data, "departement_id");
  const filiereProps = keyExists(data, "filiere_id");
  const {
    data: facList,
    isLoading: fetchFacList,
    isError: fail,
  } = useFacultyList();
  const {
    data: depList,
    isLoading: fetchDepList,
    isError: failLoadingDep,
  } = useDepartementList();
  const {
    data: filiereList,
    isLoading: fetchFiliereList,
    isError: failLoadingFiliere,
  } = useFiliereList();
  console.log(filiereList, data);

  const rows = data.map((d, i) => (
    <Table.Tr key={d.id}>
      <Table.Td>{i}</Table.Td>
      <Table.Td>{d.nom}</Table.Td>
      {falcultyProps && (
        <Table.Td>
          {fetchFacList && <Skeleton height={8} radius="xl" />}
          {fail && "erreur de chargement"}
          {facList && (
            <Text>
              {
                facList.filter((f) => {
                  return f.id == d.faculte_id;
                })[0]?.nom
              }
            </Text>
          )}
        </Table.Td>
      )}
      {departementProps && (
        <Table.Td>
          {fetchDepList && <Skeleton height={8} radius="xl" />}
          {failLoadingDep && "erreur de chargement"}
          {depList && (
            <Text>
              {
                depList.filter((dep) => {
                  return dep.id === d.departement_id;
                })[0]?.nom
              }
            </Text>
          )}
        </Table.Td>
      )}
      {filiereProps && (
        <Table.Td>
          {fetchFiliereList && <Skeleton height={8} radius="xl" />}
          {failLoadingFiliere && "erreur de chargement"}
          {filiereList && (
            <Text>
              {
                filiereList.filter((f) => {
                  return f.id === d.filiere_id;
                })[0]?.nom
              }
            </Text>
          )}
        </Table.Td>
      )}
      <Table.Td>
        <Button
          c={"white"}
          bg={"red"}
          loading={index != null && isError === false ? index === d.id : false}
          onClick={() => handleClick!(d.id)}
        >
          supprimer
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped withTableBorder mt={"sm"}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>N*</Table.Th>
          <Table.Th>Nom</Table.Th>
          {falcultyProps && <Table.Th>Faculte</Table.Th>}
          {departementProps && <Table.Th>Departement</Table.Th>}
          {filiereProps && <Table.Th>Filiere</Table.Th>}
          <Table.Th>action</Table.Th>
        </Table.Tr>
      </Table.Thead>
      {isLoading && (
        <Table.Tbody>
          <Table.Tr w={"100%"}>
            <Table.Th>
              <Skeleton height={8} my={"sm"} width={"80%"} />
            </Table.Th>
            <Table.Th>
              <Skeleton height={8} my={"sm"} width={"80%"} />
            </Table.Th>
            <Table.Th>
              <Skeleton height={8} my={"sm"} width={"80%"} />
            </Table.Th>
          </Table.Tr>
        </Table.Tbody>
      )}

      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
export default DataTable;
