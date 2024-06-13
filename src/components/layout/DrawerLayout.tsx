// import React from "react";
// import ListItemLink from "../ui/ListItemLink";
import { Logout } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import TransitionOutlet from "@components/ui/TransitionOutlet";
import {
  useLogoutMutation,
  useGetAuthDataQuery,
  useGetUserProfileDataMutation,
} from "@/hooks/auth";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import {
  AppBar,
  Avatar,
  CircularProgress,
  Container,
  // Drawer,
  IconButton,
  // List,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  // drawerClasses,
  // useMediaQuery,
  // useTheme,
} from "@mui/material";
import AppLink from "../ui/AppLink";

// const DRAWER_WIDTH = 240;

function DrawerLayout() {
  const queryClient = useQueryClient();
  // const theme = useTheme();
  // const [openDrawer, setOpenDrawer] = React.useState(false);
  // const temporaryMode = useMediaQuery(theme.breakpoints.down("lg"));
  const { data: authData, isPending: isAuthDataLoading } =
    useGetUserProfileDataMutation();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const popupState = usePopupState({
    variant: "popover",
    popupId: "profile-menu",
  });

  // function handleCloseDrawer() {
  //   setOpenDrawer(false);
  // }

  // function handleOpenDrawer() {
  //   setOpenDrawer(true);
  // }

  function handleLogout() {
    logout(undefined, {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: useGetAuthDataQuery.getKey(),
        });
        queryClient.removeQueries();
      },
    });

    popupState.close();
  }

  return (
    <div className="min-h-screen">
      {/* <Drawer
        anchor={"left"}
        open={openDrawer}
        onClose={handleCloseDrawer}
        sx={{
          width: DRAWER_WIDTH,
          [`& .${drawerClasses.paper}`]: {
            flexShrink: 0,
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
        variant={temporaryMode ? "temporary" : "permanent"}
      >
        <List disablePadding>
          <ListItemLink primary={"Wallets"} to={"/"} />

          <ListItemLink
            primary={"Advanced Employee Monitor"}
            to={"/dashboard/advanced-employee-monitor"}
          />

          <ListItemLink primary={"Threat Feed"} to={"/dashboard/threats"} />
        </List>
      </Drawer> */}

      <main className="min-h-screen">
        <AppBar elevation={0} position={"relative"}>
          <Container maxWidth={"xl"}>
            <Toolbar disableGutters>
              <div className={"flex-1"} />

              <div>
                <IconButton
                  size={"large"}
                  color={"inherit"}
                  {...bindTrigger(popupState)}
                  disabled={isAuthDataLoading}
                >
                  {isAuthDataLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Avatar alt={"profile"} />
                  )}
                </IconButton>
                <Menu
                  {...bindMenu(popupState)}
                  anchorOrigin={{
                    horizontal: "left",
                    vertical: "bottom",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  classes={{
                    paper: "min-w-[250px] max-w-[305px]",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      popupState.close();
                    }}
                    className={"py-3"}
                    divider
                  >
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>

                    <ListItemText
                      primary={authData?.name}
                      secondary={authData?.email}
                      primaryTypographyProps={{
                        className: "truncate font-medium text-lg",
                      }}
                      secondaryTypographyProps={{
                        className:
                          "truncate text-base text-[#797979] font-medium",
                      }}
                    />
                  </MenuItem>

                  <MenuItem
                    divider
                    component={AppLink}
                    onClick={() => {
                      popupState.close();
                    }}
                    className={"py-4"}
                    to={"/"}
                    disabled={isAuthDataLoading}
                  >
                    <ListItemText>Wallets</ListItemText>
                  </MenuItem>

                  <MenuItem
                    divider
                    component={AppLink}
                    onClick={() => {
                      popupState.close();
                    }}
                    className={"py-4"}
                    to={"/transactions"}
                    disabled={isAuthDataLoading}
                  >
                    <ListItemText>Transactions</ListItemText>
                  </MenuItem>

                  <MenuItem
                    className={"py-3"}
                    onClick={handleLogout}
                    disabled={isAuthDataLoading || isLoggingOut}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" className="text-carminePink" />
                    </ListItemIcon>
                    <ListItemText className="text-carminePink">
                      Sign Out
                    </ListItemText>
                  </MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth={"xl"}>
          <TransitionOutlet />
        </Container>
      </main>
    </div>
  );
}

export default DrawerLayout;
