import React from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";

function LoadableButton({
  loading = false,
  ...props
}: React.PropsWithChildren<ButtonProps & { loading?: boolean }>) {
  return (
    <Button
      {...props}
      disabled={loading ? loading : props.disabled}
      endIcon={
        loading ? <CircularProgress color="inherit" size={20} /> : props.endIcon
      }
    />
  );
}

export default LoadableButton;
