import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Group, Text, Code } from "@mantine/core";
import {
  IconLogout,
  IconBroadcast,
  IconBell,
  IconBellRinging2,
  TablerIconsProps,
  IconSchool,
} from "@tabler/icons-react";
import Logo from "./../assets/icons/logo.svg?react";
import classes from "./../styles/navbar.module.css";
import { useAuth } from "../context/AppContext";
import { IconUserSearch } from "@tabler/icons-react";
type linkPage = {
  link: string;
  label: string;
  icon: (props: TablerIconsProps) => JSX.Element;
};
export const linkPageAdmin: linkPage[] = [
  {
    link: "/admin",
    label: "Vos alertes",
    icon: IconBell,
  },
  {
    link: "/admin/add",
    label: "Ajouter une alerte",
    icon: IconBellRinging2,
  },
];
const linkPageSuperAdmin = [
  ...linkPageAdmin,
  {
    link: "/admin/publish",
    label: "Ajouter une publication",
    icon: IconBroadcast,
  },
  {
    link: "/admin/admin-list",
    label: "Liste Administrateur",
    icon: IconUserSearch,
  },
  {
    link: "/admin/manage-fac",
    label: "Gerer la faculte ",
    icon: IconSchool,
  },
];

export default function NavBar() {
  const { doSignOut, isAdmin, isSuperAdmin } = useAuth();
  const [dataLink, setDataLink] = useState<linkPage[]>([]);
  const [links, setLinks] = useState<React.JSX.Element[]>([]);
  useEffect(() => {
    if (isAdmin) {
      setDataLink(linkPageAdmin);
    }
    if (isSuperAdmin) {
      setDataLink(linkPageSuperAdmin);
    }
  }, []);
  useEffect(() => {
    const link = dataLink.map((item) => (
      <NavLink end className={classes.link} to={item.link} key={item.label}>
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </NavLink>
    ));
    setLinks(link);
  }, [dataLink]);

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Logo width={50} />
          <Code>
            <Text fw={"bold"}>U-Sentry | Admin</Text>
          </Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            doSignOut!();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
