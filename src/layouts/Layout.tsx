import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Center, Loader } from "@mantine/core";

import { useAuth } from "../context/AppContext";
//type Props = {};
function Layout() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    //fake session for test ONLY
    setLoading(false);
    /*if (!session) {
      setTimeout(() => {
        setLoading(false);
        navigate("/", {
          replace: true,
        });
      }, 1000);
    } else {
      setTimeout(() => {
        setLoading(false);
        if (!location.pathname.includes("admin")) {
          navigate("/admin", {
            replace: true,
          });
        }
      }, 1000);
    }*/
  }, [location.pathname, session]);
  if (isLoading) {
    return (
      <Center h={"100vh"}>
        <Loader color="blue" />
      </Center>
    );
  }
  return <Outlet />;
}

export default Layout;
/**
 * import React, { useContext, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Center, Loader } from "@mantine/core";

import { Context } from "../context/AppContext";
//type Props = {};
function Layout() {
  const navigate = useNavigate();
  const { session } = useContext(Context);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (!session) {
      if (location.pathname !== "/signIn") {
        setTimeout(() => {
          setLoading(false);
          navigate("/", {
            replace: true,
          });
        }, 1000);
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        if (!location.pathname.includes("admin")) {
          navigate("/admin", {
            replace: true,
          });
        }
      }, 1000);
    }
  }, [location.pathname, session]);
  if (isLoading) {
    return (
      <Center h={"100vh"}>
        <Loader color="blue" />
      </Center>
    );
  }
  return <Outlet />;
}

 */
