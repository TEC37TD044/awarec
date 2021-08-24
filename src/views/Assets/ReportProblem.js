import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import React from "react";
import { Assignment } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
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

const useStyles = makeStyles(styles);
export default function ReportProblem() {
  const history = useHistory();
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm({});
  const { authUser } = useAuth();

  const onSubmit = async (data) => {
    let customData = {
      descripcion: data.description,
      titulo: data.title,
      reportadoPor: authUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      estado: "OPENED",
    };
    await db
      .collection("asset_failure_report")
      .add(customData)
      .then(() => {
        history.push("/admin/my-assets");
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
              <h4 className={classes.cardIconTitle}>Reportar Problema </h4>
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
                      Descripción del problema *
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
                        name: "description",
                      }}
                      error={errors && errors.description ? true : false}
                      inputRef={register()}
                      helperText={errors && errors.description?.message}
                      placeholder="Porfavor, describa el problema detalladamente"
                    />
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
                      onClick={() => history.push("/admin/my-assets")}
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
