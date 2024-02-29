import React, { useContext, useState } from "react";

import { Link } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Center,
  Stack,
} from "@mantine/core";
import Logo from "./../assets/icons/logo.svg?react";
import { Context } from "../context/AppContext";
import { useForm } from "@mantine/form";

function SignIn() {
  const { signUp, setSession } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: { email: "", password: "", confirmPassword: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "email invalide"),
      password: (value) =>
        value.length < 1
          ? "mot de passe vide !!"
          : value.length < 6
          ? "mot de passe faible"
          : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "mot de passe non identiques" : null,
    },
  });
  return (
    <Container size={420} my={40}>
      <Stack gap={0}>
        <Center>
          <Logo width={100} />
        </Center>
        <Center>
          <Text fw={"bold"}>Admin U-sentry</Text>
        </Center>
      </Stack>
      <Title
        ta="center"
        //className={classes.title}
      >
        Creez votre compte !
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Vous avez deja de compte ?{" "}
        <Anchor size="sm" component={Link} to={"/"}>
          Connectez vous
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((d, e) => {
            e?.preventDefault();
            setLoading(true);
            signUp(d)
              .then((result) => {
                if (result == null) {
                  form.setFieldError("email", "erreur");
                  form.setFieldError("password", "erreur");
                } else {
                  setSession!(result);
                }
              })
              .catch((e) => {
                console.log(e);
                form.setFieldError("email", "email invalide");
                form.setFieldError("password", "mot de passe invalide");
              })
              .finally(() => setLoading(false));
          })}
        >
          <TextInput
            label="email"
            placeholder="email@gmail.com"
            withAsterisk
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Mot de passe"
            placeholder="votre mot de passe"
            mt="md"
            withAsterisk
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirmation"
            placeholder="confirmez otre mot de passe"
            withAsterisk
            mt="md"
            {...form.getInputProps("confirmPassword")}
          />
          <Button type="submit" fullWidth mt="xl" loading={loading}>
            Creer votre compte
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default SignIn;
