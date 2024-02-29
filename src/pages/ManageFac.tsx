import { Title, Group } from "@mantine/core";
import FacultyDataTable from "../components/FacultyDataTable.compent";
import React from "react";
import DepartementDataTable from "../components/DepartementDataTable.component";
import FiliereDataTable from "../components/FiliereDataTable.component";
import NiveauDataTable from "../components/NiveauDataTable.component";
function ManageFac() {
  return (
    <>
      <Group justify="space-between">
        <Title order={2}>Gerer votre faculte</Title>
      </Group>
      <FacultyDataTable />
      <DepartementDataTable />
      <FiliereDataTable />
      <NiveauDataTable />
    </>
  );
}

export default ManageFac;
