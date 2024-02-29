import { Button, Skeleton, Table, Text } from "@mantine/core";
import React from "react";
import { useFacultyList, useProfileList } from "../hooks/api";
type TableProps = {
  data: { fonction: number | null; id: number; uuid: string }[];
  handleClick?: ({ id, auth }: { id: number; auth: string }) => void;
  isLoading?: boolean;
  index?: number | null;
  isError?: boolean;
};
function AdminListTable({ data, handleClick, index, isLoading }: TableProps) {
  const {
    data: facList,
    isLoading: fetchFacList,
    isError: fail,
  } = useFacultyList();

  const {
    data: profileList,
    isLoading: fetchProfileList,
    isError: failProfile,
  } = useProfileList();

  const rows = data.map((d, i) => (
    <Table.Tr key={d.id}>
      <Table.Td>{i}</Table.Td>
      <Table.Td>
        {fetchProfileList && <Skeleton height={8} radius="xl" />}
        {failProfile && "erreur de chargement"}
        {profileList && (
          <Text>
            {
              profileList.filter((f) => {
                return f.id == d.uuid;
              })[0]?.username
            }
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        {fetchProfileList && <Skeleton height={8} radius="xl" />}
        {failProfile && "erreur de chargement"}
        {profileList && (
          <Text>
            {
              profileList.filter((f) => {
                return f.id == d.uuid;
              })[0]?.email
            }
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        {fetchFacList && <Skeleton height={8} radius="xl" />}
        {fail && "erreur de chargement"}
        {facList && (
          <Text>
            {
              facList.filter((f) => {
                return f.id == d.fonction;
              })[0]?.nom
            }
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        <Button
          c={"white"}
          bg={"red"}
          loading={index != null ? index === d.id : false}
          onClick={() => handleClick!({ id: d.id, auth: d.uuid })}
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
          <Table.Th>Email</Table.Th>
          <Table.Th>Gerant faculte</Table.Th>
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

export default AdminListTable;
