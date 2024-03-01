import React, { useEffect, useState } from "react";
import {
  Text,
  Title,
  Skeleton,
  Card,
  Group,
  Center,
  Box,
  Image,
  Button,
  Flex,
} from "@mantine/core";
import { useAlertList, useMutationDeleteAlert } from "../hooks/api";
import { useAuth } from "../context/AppContext";
import EmptyBox from "./../assets/images/empty-box.png";
import { useQueryClient } from "react-query";

function Home() {
  const { session, isAdmin, isSuperAdmin } = useAuth();
  const [user] = useState(session?.user);
  const { data, error, isLoading: fetchingAlertList } = useAlertList(user?.id);
  const [Id, setId] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(false);
  const deleteAlerte = useMutationDeleteAlert(Id!);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (Id != null) {
      setLoading(true);
      deleteAlerte.mutate();
    }
  }, [Id]);
  useEffect(() => {
    if (deleteAlerte.isSuccess) {
      queryClient.invalidateQueries(["alert-list"]);
      setLoading(false);
    }
  }, [deleteAlerte.isSuccess]);

  return (
    <>
      <Title order={2}>Bienvenu , {user?.email}</Title>
      {isAdmin && <Text>Vous etes connecter en tant que admininstrateur</Text>}
      {isSuperAdmin && (
        <Text>Vous etes connecter en tant que super admininstrateur</Text>
      )}
      {!fetchingAlertList && data?.length !== 0 && (
        <Text size="xl">Voici vos alertes :</Text>
      )}
      {fetchingAlertList ? (
        <Group w={"100%"} mt={"md"}>
          <Card withBorder w={"30%"}>
            <Skeleton height={20} radius="xl" w={"30%"} />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
          </Card>
          <Card withBorder w={"30%"}>
            <Skeleton height={20} radius="xl" w={"30%"} />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
          </Card>
          <Card withBorder w={"30%"}>
            <Skeleton height={20} radius="xl" w={"30%"} />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
          </Card>
        </Group>
      ) : error ? (
        <Center h={"fit-content"}>
          <Text fw={"bold"}>Oups une erreur!</Text>
        </Center>
      ) : (
        <Box mt="md">
          <Group>
            {data?.map((data, id) => (
              <Card withBorder w={"30%"} key={id}>
                <Card.Section withBorder>
                  <Image src={data.imageURL} w={200} h={150} fit="cover" />
                </Card.Section>
                <Group justify="space-between" wrap="nowrap" mt={"xs"}>
                  <Box>
                    <Text fw={"bold"} lineClamp={2}>
                      {data.title}
                    </Text>
                    <Text lineClamp={1} size="sm">
                      {data.description}
                    </Text>
                  </Box>
                  <Button
                    bg={"red"}
                    c={"white"}
                    loading={isLoading && Id == data.id}
                    onClick={() => setId(data.id)}
                  >
                    Supprimer
                  </Button>
                </Group>
              </Card>
            ))}
          </Group>
        </Box>
      )}
      {data?.length == 0 && (
        <Center h={"60vh"}>
          <Flex direction={"column"} justify={"center"} align={"center"}>
            <Image src={EmptyBox} w={200} />
            <Text ta={"center"} size="xl">
              Vous n'avez pas publier d'alerte
            </Text>
          </Flex>
        </Center>
      )}
    </>
  );
}

export default Home;
