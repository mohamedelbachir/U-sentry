import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAlertList } from "../hooks/api";
import { Skeleton, Image } from "@mantine/core";
import { useAuth } from "../context/AppContext";
function DetailAlert() {
  const { session } = useAuth();
  const [user] = useState(session?.user);
  const { id } = useParams();
  const { data, error, isLoading } = useAlertList(user!.id);
  return (
    <>
      {isLoading && (
        <>
          <Skeleton height={20} radius="xl" w={"30%"} />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </>
      )}
    </>
  );
}

export default DetailAlert;
