import { Text, Center, Stack, Title, Anchor } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Center h={"100vh"}>
      <Stack gap={0}>
        <Title c={"gray"} fw={"bold"} lh={"xl"} ta={"center"}>
          404
        </Title>
        <Text>Page Introuvable !</Text>
        <Anchor component={Link} to={"/"} ta={"center"}>
          accueil
        </Anchor>
      </Stack>
    </Center>
  );
}

export default NotFoundPage;
