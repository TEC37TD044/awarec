import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { Assignment } from "@material-ui/icons";
import { useHistory, useParams, useLocation } from "react-router-dom";
import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import FormLabel from "@material-ui/core/FormLabel";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import inputValidation from "views/Assets/inputValidation";
import CardIcon from "components/Card/CardIcon.js";
import { useAuth } from "hooks/useAuth";
import { db } from "../../providers/firebase";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles(styles);
export default function MaintenanceReport() {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm({});
  const { authUser } = useAuth();
  const [status, setStatus] = useState("no");
  const { id } = useParams();
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const onSubmit = async (data) => {
    const assetId = location.state.detail;
    const available = status === "si" ? false : true;
    let customData = {
      detail: data.detail,
      titulo: data.title,
      maintenanceToName: authUser.uid,
      maintenanceToUserId: authUser.displayName,
      updatedAt: new Date(),
      maintenanceDone: true,
    };
    await db
      .collection("asset_maintenance_report")
      .doc(id)
      .update(customData)
      .then(() => {
        db.collection("assets")
          .doc(assetId)
          .update({
            available: available,
            deviceUnderMaintenced: false,
          })
          .then(() => {
            history.push("/admin/assets-maintenance");
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose" text>
              <CardIcon color="rose">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Formulario de mantenimiento realizado
              </h4>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Titulo *
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="help-text"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "text",
                        name: "title",
                      }}
                      error={errors && errors.title ? true : false}
                      inputRef={register(inputValidation.texto)}
                      helperText={errors && errors.title?.message}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Detalle del mantenimiento *
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      multiline
                      id="help-text"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "email",
                        name: "detail",
                      }}
                      error={errors && errors.detail ? true : false}
                      inputRef={register()}
                      helperText={errors && errors.detail?.message}
                      placeholder="Porfavor, describa el problema detalladamente"
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Dar de baja el recurso*
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{""}</FormLabel>
                      <RadioGroup
                        name="status"
                        value={status}
                        onChange={handleChange}
                        row
                        aria-label="position"
                      >
                        <FormControlLabel
                          value="si"
                          control={<Radio />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer justify="flex-end">
                  <GridItem xs={6} sm={6} md={4}>
                    <Button color="rose" type="submit">
                      Guardar
                    </Button>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={5}>
                    <Button
                      color="rose"
                      onClick={() => history.push("/admin/assets-maintenance")}
                    >
                      Cancelar
                    </Button>
                  </GridItem>
                </GridContainer>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
