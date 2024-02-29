import React, { useEffect, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Center,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../context/AppContext";
import Logo from "./../assets/icons/logo.svg?react";
function Login() {
  const [loading, setLoading] = useState(false);
  const { logIn, failUser } = useAuth();
  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length < 1 ? "mot de passe vide !!" : null),
    },
  });
  useEffect(() => {
    if (failUser) {
      form.setFieldError("email", "email incorret");
      form.setFieldError("password", "mot de passe incorret");
    }
  }, [failUser]);

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
        Bienvenu !
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((d, e) => {
            e?.preventDefault();
            setLoading(true);
            logIn(d)
              .then((result) => {
                if (!result) {
                  form.setFieldError("email", "email incorret");
                  form.setFieldError("password", "mot de passe incorret");
                }
              })
              .catch((e) => {
                console.log(e);
                form.setFieldError("email", "email invalide");
                form.setFieldError("password", "mot de passe invalide");
              })
              .finally(() => {
                setLoading(false);
              });
          })}
        >
          <TextInput
            label="Email"
            placeholder="email@gmail.com"
            withAsterisk
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Mot de passe"
            placeholder="votre mot de passe"
            withAsterisk
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Connectez vous
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
export default Login;
