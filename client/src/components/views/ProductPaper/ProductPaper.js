import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { IMAGE_SERVER } from "../../Config";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";
import { Dialog } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import PopUp from "../PopUp/PopUp";

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    borderRadius: 20,
  },
  media: {
    maxWidth: "100%",
    padding: 10,
    marginVertical: 10,
  },
});

export default function ProductPaper({ title, imageName, refresh }) {
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const [image, setImage] = useState("");
  const [popup, setPopup] = useState(false);
  const [edit, setEdit] = useState(false);

  const price = () => {
    const rand = 1 + 4 * Math.random();
    return Math.floor(rand);
  };
  const handleEdit = () => {};
  const handleDelete = () => {
    axios
      .delete(`${IMAGE_SERVER}/deleteImage/${imageName}`)
      .then(() => {
        enqueueSnackbar("Deleted Successfully!", { variant: "success" });
        setPopup(false);
        refresh();
      })
      .catch(() =>
        enqueueSnackbar("Something Went Wrong! Please Try Again", {
          variant: "error",
        })
      );
  };

  return (
    <>
      <Dialog
        open={popup}
        keepMounted
        onClose={() => setPopup(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Are You Sure?
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleDelete} color="secondary">
            Yes, Delete It!
          </Button>
          <Button onClick={() => setPopup(false)} color="primary">
            Nope, Maybe Later!
          </Button>
        </DialogActions>
      </Dialog>
      <PopUp
        open={edit}
        onClose={() => setEdit(false)}
        refresh={refresh}
        title={title}
        image={`${window.location.origin}${IMAGE_SERVER}/image/${imageName}`}
      />
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia>
            <img
              className={classes.media}
              src={`${window.location.origin}${IMAGE_SERVER}/image/${imageName}`}
              alt={title}
            />
          </CardMedia>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Price: {price()} ETH
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions style={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => setEdit(true)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="secondary"
            onClick={() => setPopup(true)}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
}
