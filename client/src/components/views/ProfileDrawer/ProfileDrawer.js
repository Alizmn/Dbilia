import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EmailIcon from "@material-ui/icons/Email";
import { Avatar, Button, CircularProgress } from "@material-ui/core";
import { green, blue } from "@material-ui/core/colors";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    zIndex: 0,
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  avatar: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "15%",
  },
  avatarPic: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  button: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1%",
    marginBottom: "1%",
  },
}));

export default function ProfileDrawer({
  name,
  account,
  email,
  avatar,
  product,
  loading,
}) {
  const classes = useStyles();
  if (loading)
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.avatar}>
            <CircularProgress />
          </div>
        </Drawer>
      </div>
    );

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <div className={classes.avatar}>
            {avatar ? (
              <Avatar
                variant="square"
                alt={name}
                src={avatar}
                className={classes.avatarPic}
              />
            ) : (
              <Avatar
                aria-label="avatar"
                variant="square"
                className={classes.avatarPic}
              />
            )}
          </div>
          <List>
            <ListItem>
              <ListItemIcon>
                <AccountCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SupervisedUserCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={account} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={email} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon>
                <PermMediaIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={"Product Available"} secondary={product} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MonetizationOnIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={"Available Balance"} secondary={"500 $"} />
            </ListItem>
          </List>
          <div className={classes.button}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<AddCircleIcon />}
            >
              Add new Product
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
