import { Fade } from "@mui/material";
import { useLocation, useOutlet } from "react-router-dom";
import { SwitchTransition } from "react-transition-group";

function TransitionOutlet() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  return (
    <SwitchTransition>
      <Fade timeout={300} key={location.key}>
        <span>{currentOutlet}</span>
      </Fade>
    </SwitchTransition>
  );
}

export default TransitionOutlet;
