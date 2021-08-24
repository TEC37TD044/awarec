import React from "react";
import inputValidation from "./inputValidation";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AddCircle from "@material-ui/icons/AddCircle";
import { Delete } from "@material-ui/icons";
import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import FormLabel from "@material-ui/core/FormLabel";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import PropTypes from "prop-types";

const useStyles = makeStyles(styles);
export const FormAsset = ({
  register,
  errors,
  item,
  handleInputChange,
  values,
  AddNewField,
  RemoveField,
  handleChangeName,
  handleChangeValue,
}) => {
  const classes = useStyles();

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={2}>
          <FormLabel className={classes.labelHorizontal}>Nombre *</FormLabel>
        </GridItem>
        <GridItem xs={12} sm={10}>
          <CustomInput
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              name: "name",
              value: values.name,
              onChange: (e) => handleInputChange(e),
            }}
            error={errors && errors.name ? true : false}
            helperText={errors && errors.name}
            customregister={{
              ...register("name", inputValidation.textoCustom),
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={2}>
          <FormLabel className={classes.labelHorizontal}>
            Descripción *
          </FormLabel>
        </GridItem>
        <GridItem xs={12} sm={10}>
          <CustomInput
            multiline
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              name: "description",
              value: values.description,
              onChange: (e) => handleInputChange(e),
            }}
            error={errors && errors.description ? true : false}
            helperText={errors && errors.description}
            customregister={{
              ...register("description", inputValidation.textoCustom),
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={2}>
          <FormLabel className={classes.labelHorizontal}>Marca *</FormLabel>
        </GridItem>
        <GridItem xs={12} sm={10}>
          <CustomInput
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              name: "make",
              value: values.make,
              onChange: (e) => handleInputChange(e),
            }}
            error={errors && errors.make ? true : false}
            helperText={errors && errors.make}
            customregister={{
              ...register("make", inputValidation.textoCustom),
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={2}>
          <FormLabel className={classes.labelHorizontal}>Modelo *</FormLabel>
        </GridItem>
        <GridItem xs={12} sm={10}>
          <CustomInput
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              name: "model",
              value: values.model,
              onChange: (e) => handleInputChange(e),
            }}
            error={errors && errors.model ? true : false}
            helperText={errors && errors.model}
            customregister={{
              ...register("model", inputValidation.textoCustom),
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={2}>
          <FormLabel className={classes.labelHorizontal}>Serie</FormLabel>
        </GridItem>
        <GridItem xs={12} sm={10}>
          <CustomInput
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              name: "serie",
              value: values.serie,
              onChange: (e) => handleInputChange(e),
            }}
          />
        </GridItem>
      </GridContainer>

      {item.length > 0 &&
        item.map((item) => (
          <GridContainer key={item.id}>
            <GridItem xs={12} sm={2}>
              <CustomInput
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "text",
                  name: item.id,
                  value: item.name,
                  onChange: (e) => handleChangeName(e, item.id),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={9}>
              <CustomInput
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "text",
                  name: item.id,
                  value: item.value,
                  onChange: (e) => handleChangeValue(e, item.id),
                }}
              />
            </GridItem>
            <GridItem xs={1} sm={1}>
              <IconButton
                color="default"
                aria-label="remover campo"
                className={classes.deleteButton}
                onClick={() => RemoveField(item.id)}
              >
                <Delete />
              </IconButton>
            </GridItem>
          </GridContainer>
        ))}
      <GridContainer>
        <GridItem xs={12} sm={2}>
          <label htmlFor="icon-addCircle" className={classes.labelHorizontal}>
            <IconButton
              aria-label="agregar campo"
              component="span"
              onClick={AddNewField}
              color="default"
            >
              <AddCircle fontSize="large" />
            </IconButton>
          </label>
        </GridItem>
      </GridContainer>
    </>
  );
};

FormAsset.propTypes = {
  register: PropTypes.object,
  errors: PropTypes.object,
  item: PropTypes.object,
  handleInputChange: PropTypes.func,
  values: PropTypes.object,
  AddNewField: PropTypes.func,
  RemoveField: PropTypes.func,
  handleChangeName: PropTypes.func,
  handleChangeValue: PropTypes.func,
};
