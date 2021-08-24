/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../providers/firebase";
// @material-ui/icons
// import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Report from "@material-ui/icons/Report";
// import Favorite from "@material-ui/icons/Favorite";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import ReactTable from "components/ReactTable/ReactTable.js";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import SweetAlert from "react-bootstrap-sweetalert";

import { useForm } from "react-hook-form";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useHistory } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import moment from "moment";
require("moment/locale/es.js");
import _ from "lodash";

const useStylesBase = makeStyles(styles);
const useStyles = makeStyles({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
});

export default function MyAssetReports() {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const classes = useStyles();
  const classesBase = useStylesBase();
  const { authUser } = useAuth();

  useEffect(() => {
    getReports();
  }, []);
  const warningWithConfirmMessage = (estado, id) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title={!estado ? "Cerrar reporte" : "Reabrir reporte"}
        onConfirm={() => success(estado, id)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classesBase.button + " " + classesBase.success}
        cancelBtnCssClass={classesBase.button + " " + classesBase.danger}
        confirmBtnText="Si"
        cancelBtnText="Cancelar"
        showCancel
        //reverseButtons={true}
      ></SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };

  const success = async (estado, id) => {
    await db
      .collection("asset_failure_report")
      .doc(id)
      .update({
        estado: estado ? "OPENED" : "CLOSED",
      })
      .then(() => {
        getReports();
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="El reporte fue actualizado!"
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnCssClass={classesBase.button + " " + classesBase.success}
          >
            Se actualizo el estado del reporte.
          </SweetAlert>
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleChangeChecked = ({ target }, id) => {
    let estado = target.checked;
    warningWithConfirmMessage(estado, id);
  };
  function getReports() {
    db.collection("asset_failure_report")
      .get()
      .then(function (list) {
        if (list) {
          const mappedData = list.docs.map((item, index) => {
            const data = item.data();
            let message = data.estado === "OPENED" ? "Abierto" : "Cerrado";
            let estado = data.estado === "OPENED" ? true : false;
            return {
              id: index,
              titulo: data.titulo,
              descripcion: data.descripcion,
              fecha: moment(data.createdAt.toDate()).format("LLLL"),
              actions: (
                <div className="actions-right">
                  <FormControlLabel
                    className={classes.labelLeftHorizontal}
                    control={
                      <Switch
                        name="estado"
                        color="primary"
                        checked={estado}
                        onChange={(e) => handleChangeChecked(e, item.id)}
                      />
                    }
                    label={
                      <Box component="div" fontSize={14}>
                        {message}
                      </Box>
                    }
                    labelPlacement="start"
                  />{" "}
                </div>
              ),
            };
          });
          setData(mappedData);
        }
      });
  }

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <DesktopMacIcon />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Mis reportes de fallas </h4>
          </CardHeader>
          <CardBody>
            {!_.isEmpty(data) && (
              <ReactTable
                columns={[
                  {
                    Header: "Titulo",
                    accessor: "titulo",
                  },
                  {
                    Header: "Descripción",
                    accessor: "descripcion",
                  },
                  {
                    Header: "Fecha del Reporte",
                    accessor: "fecha",
                  },
                  {
                    Header: "Estado",
                    accessor: "actions",
                  },
                ]}
                data={data}
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
      {alert}
    </GridContainer>
  );
}
