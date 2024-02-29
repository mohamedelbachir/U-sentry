import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Group, Box } from "@mantine/core";
import NavBar, { linkPageAdmin } from "../components/NavBar.component";
import { useAuth } from "../context/AppContext";

function ProtectedRoute() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAdmin) {
      if (
        linkPageAdmin.filter((link) => link.link === location.pathname)
          .length === 0
      ) {
        navigate("/admin", { replace: true });
      }
    }
  }, [location.pathname]);

  return (
    <>
      <Group align="flex-start">
        <NavBar />
        <Box w={"70%"} my={"md"}>
          <Outlet />
        </Box>
      </Group>
    </>
  );
}

export default ProtectedRoute;
