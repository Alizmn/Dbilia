import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IMAGE_SERVER } from "../../Config";
import FormData from "form-data";
import { useSnackbar } from "notistack";
// Material-UI imports
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
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
  Button,
  InputLabel,
  FormControl,
  OutlinedInput,
  Card,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";

import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import PopUp from "../PopUp/PopUp";
import ProductPaper from "../ProductPaper/ProductPaper";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "10%",
  },
  alert: {
    minWidth: "40%",
    paddingTop: "1%",
  },
  root: {
    minWidth: "50%",
    boxShadow: "5px 5px 5px 5px grey",
  },
  media: {
    height: "300px",
    paddingTop: "56.25%", // 16:9
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    height: 400,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginTop: 15,
    width: "50%",
    justifyContent: "space-between",
  },
  button: {
    display: "flex",
    justifyContent: "space-around",
    padding: "2%",
    height: 35,
  },
}));

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  //  ^------true if the app is loading
  const [title, setTitle] = useState(""); // |-> the current title in text input
  const [serverTitle, setServerTitle] = useState(""); // |-> the title from server
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [popup, setPopup] = useState(false);
  const [products, setProducts] = useState([]);

  const classes = useStyles();
  const user = useSelector((state) => state.user);

  const fileInput = useRef(null);

  let data;

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    axios.get(`${IMAGE_SERVER}/`).then((result) => {
      setProducts(result.data);
      console.log("====================================");
      console.log(result.data);
      console.log("====================================");
    });
    // setTitle("");
    // axios // the url can use directly without get req but it's good to have it for error handling
    //   .get(`${IMAGE_SERVER}/`)
    //   .then((doc) => {
    //     if (doc.status === 200) {
    //       setPreviewUrl(`${window.location.origin}${IMAGE_SERVER}`);
    //       setServerTitle(doc.headers.title);
    //     }
    //   })
    //   .catch((error) => console.log(error));
  }, [refresh]);

  const handleFile = (file) => {
    //Carry out any file validations here...
    setImage(file);
    file && file !== null && setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleOnDrop = (event) => {
    //prevent the browser from opening the image
    event.preventDefault();
    event.stopPropagation();
    //grab the image file
    let imageFile = event.dataTransfer.files[0];
    handleFile(imageFile);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleSave = () => {
    if (!title)
      return enqueueSnackbar("Please Provide a Title!", { variant: "error" });
    if (!previewUrl)
      return enqueueSnackbar("Please Add a Picture!", { variant: "error" });
    let formData = new FormData();
    formData.append("userImage", image);
    formData.append("title", title);

    axios
      .patch(`${IMAGE_SERVER}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setRefresh(!refresh);
        enqueueSnackbar("Uploaded Successfully!", { variant: "success" });
      })
      .catch(() =>
        enqueueSnackbar("Something went wrong, please try again!", {
          variant: "error",
        })
      );
  };
  const handleDelete = () => {
    axios
      .delete(`${IMAGE_SERVER}/deleteImage`)
      .then(() => {
        setPreviewUrl("");
        setImage(null);
        setRefresh(!refresh);
        enqueueSnackbar("Deleted Successfully!!", { variant: "success" });
      })
      .catch(() =>
        enqueueSnackbar("Something went wrong, please try again!", {
          variant: "error",
        })
      );
  };

  return (
    <>
      {loading ? (
        <ProfileDrawer loading={loading} />
      ) : (
        <ProfileDrawer
          name={user.userData.name}
          account={user.userData.isAdmin ? "Admin" : "Regular User"}
          email={user.userData.email}
          avatar={user.userData.image}
          product={products.length}
          onClick={() => setPopup(true)}
        />
      )}

      <PopUp
        open={popup}
        onClose={() => setPopup(false)}
        refresh={() => setRefresh(!refresh)}
      />

      <Grid
        container
        style={{
          marginLeft: 300,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {products
          ? products.map((product, index) => (
              <Grid
                key
                item
                xs={12}
                lg={3}
                md={4}
                spacing={3}
                key={index}
                style={{ marginLeft: 50, marginTop: 100 }}
              >
                <ProductPaper
                  title={product.title}
                  imageName={product.image}
                  refresh={() => setRefresh(!refresh)}
                />
              </Grid>
            ))
          : ""}
      </Grid>
    </>
  );
}

export default ProfilePage;
