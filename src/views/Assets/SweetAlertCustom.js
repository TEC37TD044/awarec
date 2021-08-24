import { useForm } from "hooks/useForm";
import React from "react";
import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import SweetAlert from "react-bootstrap-sweetalert";
import CustomInput from "components/CustomInput/CustomInput";
import inputValidation from "./inputValidation";
import Button from "components/CustomButtons/Button.js";
import PropTypes from "prop-types";

const useStyles = makeStyles(styles);

export const SweetAlertCustom = (props) => {
  const classes = useStyles();
  const {
    register,
    errors,
    values,
    handleInputChange,
    handleSubmit,
  } = useForm({ descripcion: "", titulo: "" });
  const { hideAlert, onConfirmSubmit } = props;

  return (
    <SweetAlert
      required
      style={{ display: "block", marginTop: "-100px" }}
      title="Reportar Problema"
      onConfirm={() => hideAlert()}
      onCancel={() => hideAlert()}
      confirmBtnCssClass={classes.button + " " + classes.success}
      showCancel={false}
      showConfirm={false}
      // customButtons={
      //   <React.Fragment>
      //     <Button
      //       className={classes.button + " " + classes.danger}
      //       onClick={() => hideAlert()}
      //     >
      //       Cancelar
      //     </Button>{" "}
      //     &nbsp;&nbsp;
      //     <Button
      //       type="submit"
      //       className={classes.button + " " + classes.success}
      //       // onClick={() => hideAlert()}
      //     >
      //       Ok
      //     </Button>
      //   </React.Fragment>
      // }
    >
      <>
        <form onSubmit={(e) => handleSubmit(e, onConfirmSubmit)}>
          <CustomInput
            labelText="Titulo"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              name: "titulo",
              value: values.titulo,
              onChange: (e) => handleInputChange(e),
            }}
            error={errors && errors.titulo ? true : false}
            helperText={errors && errors.titulo}
            customregister={{
              ...register("titulo", inputValidation.textoCustom),
            }}
          />
          <br />
          <CustomInput
            labelText="Descripción del problema"
            multiline
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              name: "descripcion",
              value: values.descripcion,
              onChange: (e) => handleInputChange(e),
            }}
            error={errors && errors.descripcion ? true : false}
            helperText={errors && errors.descripcion}
            customregister={{
              ...register("descripcion", inputValidation.textoCustom),
            }}
          />
          <br />
          {/* <Button
            type="submit"
            className={classes.button + " " + classes.success}
           onClick={() => hideAlert()}
          >
            fetch
          </Button> */}
          <Button
            className={classes.button + " " + classes.danger}
            onClick={() => hideAlert()}
          >
            Cancelar
          </Button>{" "}
          &nbsp;&nbsp;
          <Button
            type="submit"
            className={classes.button + " " + classes.success}
          >
            Ok
          </Button>
        </form>
      </>
    </SweetAlert>
  );
};

SweetAlertCustom.propTypes = {
  hideAlert: PropTypes.func,
  onConfirmSubmit: PropTypes.func,
};
