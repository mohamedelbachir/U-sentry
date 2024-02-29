import React from "react";
import { Route, Routes } from "react-router-dom";

//pages
import Home from "./pages/Home";
//import SignIn from "./pages/SignIn";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";
import AddAlert from "./pages/AddAlert";

//Layout
import Layout from "./layouts/Layout";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Publish from "./pages/Publish";
import AdminList from "./pages/AdminList";
import ManageFac from "./pages/ManageFac";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="admin" element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="add" element={<AddAlert />} />
            <Route path="publish" element={<Publish />} />
            <Route path="admin-list" element={<AdminList />} />
            <Route path="manage-fac" element={<ManageFac />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
