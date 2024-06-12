import React from "react";
import { useGetAuthDataQuery } from "@/hooks/auth";
import { Navigate, useLocation } from "react-router-dom";
import FullPageSpinner from "@components/ui/FullPageSpinner";

function RequireAuth({ children }: React.PropsWithChildren) {
  const location = useLocation();
  const { data: authData, isLoading, isError, error } = useGetAuthDataQuery();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (!authData?.isLoggedin) {
    return (
      <Navigate
        replace
        to={"/auth/login"}
        state={{ nextPage: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}

export default RequireAuth;
