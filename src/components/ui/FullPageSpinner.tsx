import { CircularProgress } from "@mui/material";

function FullPageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <CircularProgress color={"inherit"} />
      </div>
    </div>
  );
}

export default FullPageSpinner;
