import { createTheme } from "@mui/material";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root")!;
export const root = createRoot(rootElement);

export const theme = createTheme({
    components: {
        MuiPopover: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiPopper: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiDialog: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiModal: {
            defaultProps: {
                container: rootElement,
            },
        },
    },
});