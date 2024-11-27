import {
  Menu,
  MenuProps,
  MenuItem,
  MenuItemProps,
  MenuList,
  MenuListProps,
} from "@mui/material";

export const MuiMenu = (props: MenuProps) => <Menu {...props} />;
export const MuiMenuItem = (props: MenuItemProps) => <MenuItem {...props} />;
export const MuiMenuList = (props: MenuListProps) => <MenuList {...props} />;
