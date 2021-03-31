import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { IMAGE_SERVER } from "../../Config";

import {
  Paper,
  CardMedia,
  Typography,
  InputLabel,
  FormControl,
  OutlinedInput,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";

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

  const { enqueueSnackbar } = useSnackbar();

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (props.title) setTitle(props.title);
    if (props.image) setPreviewUrl(props.image);
  }, [props.title, props.image]);

  const handleOnDrop = (event) => {
    //Prevent the browser from opening the image
    event.preventDefault();
    event.stopPropagation();
    //Grab the image file
    let imageFile = event.dataTransfer.files[0];
    handleFile(imageFile);
  };
  const handleFile = (file) => {
    //Carry out any file validations here...
    setImage(file);
    file && file !== null && setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (edit) => {
    //                   ^----------Since update and upload are two routes, the EDIT separate them
    if (!title)
      return enqueueSnackbar("Please Provide a Title!", { variant: "error" });
    if (!previewUrl)
      return enqueueSnackbar("Please Add a Picture!", { variant: "error" });
    let formData = new FormData();
    if (image) formData.append("userImage", image);
    formData.append("title", title);

    edit
      ? axios
          .put(`${IMAGE_SERVER}/update/${props.imageName}`, formData)
          .then(() => {
            enqueueSnackbar("Editted Successfully!", { variant: "success" });
            props.refresh();
            props.onClose();
          })
          .catch(() => {
            enqueueSnackbar("Something went wrong!", {
              variant: "error",
            });
          })
      : axios
          .post(`${IMAGE_SERVER}/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            enqueueSnackbar("Uploaded Successfully!", { variant: "success" });
            props.refresh();
            props.onClose();
          })
          .catch(() =>
            enqueueSnackbar(
              "It seems you alrady have the picture! Please double check and try again!",
              {
                variant: "error",
              }
            )
          );
  };

  return (
    <Dialog
      open={props.open}
      keepMounted
      onEnter={() => {
        setImage(null);
        fileInput.current.value = null;
        if (!props.title) {
          setPreviewUrl("");
          setTitle("");
        } else {
          setPreviewUrl(props.image);
          setTitle(props.title);
        }
      }}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        Please choose a picture along with a title!
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
        <Button autoFocus onClick={props.onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit(Boolean(props.title))}
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default PopUp;
