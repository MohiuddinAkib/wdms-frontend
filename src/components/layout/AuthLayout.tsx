import { Container, Grid } from "@mui/material";
import TransitionOutlet from "@components/ui/TransitionOutlet";

function AuthLayout() {
  return (
    <Container>
      <Grid
        container
        className="h-screen"
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Grid item lg={6}>
          <TransitionOutlet />
        </Grid>
      </Grid>
    </Container>
  );
}

export default AuthLayout;
