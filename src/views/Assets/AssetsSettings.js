import React from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(styles);

export const AssetsSettings = (props) => {
  const classes = useStyles();
  const { handleChangeChecked, values } = props;
  return (
    <GridContainer>
      <GridItem xs={12} sm={12}>
        <FormControlLabel
          className={classes.labelLeftHorizontal}
          control={
            <Switch
              name="deviceUnderMaintenced"
              color="primary"
              checked={values.deviceUnderMaintenced}
              onChange={handleChangeChecked}
            />
          }
          label={
            <Box component="div" fontSize={14}>
              Dispositivo en mantenimiento:
            </Box>
          }
          labelPlacement="start"
        />
      </GridItem>
      <GridItem xs={12} sm={12}>
        <FormControlLabel
          className={classes.labelLeftHorizontal}
          control={
            <Switch
              name="enabledForReserved"
              color="primary"
              checked={values.enabledForReserved}
              onChange={handleChangeChecked}
            />
          }
          label={
            <Box component="div" fontSize={14}>
              Habilitado para reserva:
            </Box>
          }
          labelPlacement="start"
        />
      </GridItem>
      {/* <GridItem xs={12} sm={12}>
        <FormControlLabel
          className={classes.labelLeftHorizontal}
          control={
            <Switch
              name="available"
              color="primary"
              checked={values.available}
              onChange={handleChangeChecked}
            />
          }
          label={
            <Box component="div" fontSize={14}>
              Disponible:
            </Box>
          }
          labelPlacement="start"
        />
      </GridItem> */}
    </GridContainer>
  );
};

AssetsSettings.propTypes = {
  handleChangeChecked: PropTypes.func,
  values: PropTypes.object,
};
