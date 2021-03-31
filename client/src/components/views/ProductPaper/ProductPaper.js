import React, { useState } from "react";
import axios from "axios";

import PopUp from "../PopUp/PopUp";
import { IMAGE_SERVER } from "../../Config";

import { useSnackbar } from "notistack";

import { makeStyles } from "@material-ui/core/styles";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import {
  Dialog,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";

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

const ProductPaper = (props) => {
  const { title, imageName, refresh } = props;

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const [popup, setPopup] = useState(false);
  const [edit, setEdit] = useState(false);

  //  Just Keep it Interesting :D
  const price = () => {
    const rand = 1 + 4 * Math.random();
    return Math.floor(rand);
  };

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
        imageName={imageName}
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
};

export default ProductPaper;
