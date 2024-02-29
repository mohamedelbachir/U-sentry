import React, { useState } from "react";
import { Text, Title, Skeleton, Card, Group, Center, Box } from "@mantine/core";
import { useAlertList } from "../hooks/api";
import { useAuth } from "../context/AppContext";
function Home() {
  const { session, isAdmin, isSuperAdmin } = useAuth();
  const [user] = useState(session?.user);
  //Test Case Only
  const { data = [], error, isLoading } = [];
  //const { data, error, isLoading } = useAlertList(user!.id);
  return (
    <>
      <Title order={2}>Bienvenu , {user?.email}</Title>
      {isAdmin && <Text>Vous etes connecter en tant que admininstrateur</Text>}
      {isSuperAdmin && (
        <Text>Vous etes connecter en tant que super admininstrateur</Text>
      )}
      <Text>Voici vos alertes :</Text>
      {isLoading ? (
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
          {data?.map((data) => (
            <Card withBorder w={"30%"}>
              <Text fw={"bold"}>{data.title}</Text>
              <Text lineClamp={2} size="sm">
                {data.description}
              </Text>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
}

export default Home;
