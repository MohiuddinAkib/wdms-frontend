import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemProps,
  ListItemButton,
  ListItemButtonProps,
} from "@mui/material";
import {
  matchPath,
  useLocation,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

interface ListItemLinkProps {
  to: string;
  primary: React.ReactNode;
  onMouseOver?: () => void;
  icon?: React.ReactElement;
  activePaths?: string[];
  ListItemProps?: ListItemProps;
  ListItemButtonProps?: ListItemButtonProps;
}

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  },
);

export default function ListItemLink(props: ListItemLinkProps) {
  const { pathname } = useLocation();
  const { icon, primary, to, onMouseOver, activePaths } = props;

  const match = React.useMemo(() => {
    if (!activePaths) {
      return matchPath(to, pathname) !== null;
    }

    return activePaths
      .map((eachAcPath) => matchPath(eachAcPath, pathname))
      .some((eachMatch) => eachMatch !== null);
  }, [activePaths, pathname, to]);

  return (
    <ListItem {...props.ListItemProps}>
      <ListItemButton
        to={to}
        component={Link}
        selected={match}
        onMouseOver={onMouseOver}
        classes={{
          selected: "border-r-4 border-primary border-solid",
        }}
        {...props.ListItemButtonProps}
      >
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItemButton>
    </ListItem>
  );
}
