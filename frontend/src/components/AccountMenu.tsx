import axios from "axios";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "src/AuthContext";
import { useMutation } from "src/query";

const useLogout = () => {
  const { setAuthenticated } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation(
    async () => await axios.delete("/sessions/"),
    {
      onSuccess: () => {
        setAuthenticated(false);
        queryClient.clear();
      },
    },
  );
  return logout;
};

const AccountMenu = () => {
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const onMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const onMenuClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton color="inherit" onClick={onMenuOpen}>
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        keepMounted
        onClose={onMenuClose}
        open={Boolean(anchorEl)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem component={Link} onClick={onMenuClose} to="/change-password/">
          Change password
        </MenuItem>
        <MenuItem component={Link} onClick={onMenuClose} to="/mfa/">
          MFA
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            logout();
            onMenuClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
