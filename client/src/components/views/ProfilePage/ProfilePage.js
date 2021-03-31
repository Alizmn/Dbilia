import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IMAGE_SERVER } from "../../Config";
// Material-UI imports
import { Grid } from "@material-ui/core";
// Component Imports
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import PopUp from "../PopUp/PopUp";
import ProductPaper from "../ProductPaper/ProductPaper";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  //  ^------true if the app is loading
  const [popup, setPopup] = useState(false);
  //  ^------Upload window will pop up in true
  const [products, setProducts] = useState([]);
  //  ^------State of the db result incledes title and images
  const [refresh, setRefresh] = useState(false);
  //  ^------Rerender the page in case of changing

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    axios.get(`${IMAGE_SERVER}/`).then((result) => {
      setProducts(result.data);
    });
  }, [refresh]);

  return (
    <>
      {/* Component for leftSide drawer */}
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

      {/* Upload new product */}
      <PopUp
        open={popup}
        onClose={() => setPopup(false)}
        refresh={() => setRefresh(!refresh)}
      />

      {/* Rendering photo card in the page */}
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
                item
                xs={12}
                lg={3}
                md={4}
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
};

export default ProfilePage;
