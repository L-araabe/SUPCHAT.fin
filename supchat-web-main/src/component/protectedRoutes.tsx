import React from "react";
import { useSelector } from "react-redux";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../constants/variables";

interface protectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: protectedRoutesProps) => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) {
      navigate(routes.login);
    }
  }, [user]);

  if (user?.token) {
    return <>{children}</>;
  }
};

export default ProtectedRoutes;
