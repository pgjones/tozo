import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "src/AuthContext";
import AccountMenu from "src/components/AccountMenu";

const sxToolbar = {
  paddingLeft: "env(safe-area-inset-left)",
  paddingRight: "env(safe-area-inset-right)",
  paddingTop: "env(safe-area-inset-top)",
};

const TopBar = () => {
  const { authenticated } = useContext(AuthContext);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={sxToolbar}>
          <Box sx={{ flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/">
              Tozo
            </Button>
          </Box>
          {authenticated ? <AccountMenu /> : null}
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ ...sxToolbar, marginBottom: 2 }} />
    </>
  );
};

export default TopBar;
