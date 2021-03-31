import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  CircularProgress,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EmailIcon from "@material-ui/icons/Email";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
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
    borderRadius: 15,
  },
}));

const ProfileDrawer = (props) => {
  const { name, account, email, avatar, product, loading, onClick } = props;
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
              onClick={onClick}
            >
              Add new Product
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default ProfileDrawer;
