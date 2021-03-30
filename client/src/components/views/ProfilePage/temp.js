<Grid container justify="center" className={classes.container} spacing={2}>
  {loading ? (
    <CircularProgress />
  ) : (
    <Card className={classes.root}>
      <CardContent>
        {/* Image Handling div  */}
        <div
          onDragOver={handleDragOver}
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
            <CardMedia
              className={classes.media}
              image={previewUrl}
              title={serverTitle}
            />
          ) : (
            <Paper className={classes.paper}>
              <Typography variant="h5">
                Click Here OR Drag & Drop A Photo
              </Typography>
            </Paper>
          )}
        </div>
        <div className={classes.button}>
          <FormControl
            size="small"
            className={classes.margin}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-amount">
              Image Title
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={title}
              onChange={(event) => handleTitleChange(event)}
              labelWidth={80}
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!image}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={!previewUrl}
          >
            Delete
          </Button>
        </div>
      </CardContent>

      <CardHeader
        avatar={
          user.userData !== undefined && user.userData.image ? (
            <Avatar
              variant="square"
              alt="Remy Sharp"
              src={user.userData.image}
              className={classes.avatar}
            />
          ) : (
            <Avatar
              aria-label="avatar"
              variant="square"
              className={classes.avatar}
            />
          )
        }
      />
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell variant="head">
                <Typography variant="h3">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h4">{user.userData.name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="h3">User Type</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h4">
                  {user.userData.isAdmin ? "Admin" : "Regular User"}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="h3">Email</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h4">{user.userData.email}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )}
</Grid>;
