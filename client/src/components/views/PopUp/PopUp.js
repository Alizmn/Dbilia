import React, { useEffect, useState, useRef } from "react";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CardMedia,
  CardContent,
  Avatar,
  Typography,
  Grid,
  CircularProgress,
  InputLabel,
  FormControl,
  OutlinedInput,
  Card,
} from "@material-ui/core";

import { Button } from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  media: {
    maxWidth: "100%",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    height: 400,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginBottom: "2%",
  },
}));

const PopUp = (props) => {
  const classes = useStyles();
  const fileInput = useRef(null);

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleOnDrop = (event) => {
    //prevent the browser from opening the image
    event.preventDefault();
    event.stopPropagation();
    //grab the image file
    let imageFile = event.dataTransfer.files[0];
    handleFile(imageFile);
  };
  const handleFile = (file) => {
    //Carry out any file validations here...
    setImage(file);
    file && file !== null && setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <Dialog
      open={props.open}
      keepMounted
      onEnter={() => {
        setImage(null);
        setPreviewUrl("");
        fileInput.current.value = null;
      }}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        Please choose a picture and along with a title!
      </DialogTitle>
      <DialogContent>
        <div
          className={classes.input}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleOnDrop}
          onClick={() => fileInput.current.click()}
        >
          <input
            type="file"
            accept="image/png,image/jpeg"
            ref={fileInput}
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {previewUrl ? (
            <CardMedia>
              <img className={classes.media} src={previewUrl} alt={title} />
            </CardMedia>
          ) : (
            <Paper className={classes.paper}>
              <Typography variant="h5">
                Click Here OR Drag & Drop A Photo
              </Typography>
            </Paper>
          )}
        </div>
        <FormControl size="small" variant="outlined">
          <InputLabel htmlFor="outlined-adornment-amount">
            Image Title
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            labelWidth={80}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.cancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={props.submit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default PopUp;
