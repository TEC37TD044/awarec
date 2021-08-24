/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../providers/firebase";
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
import Assignment from "@material-ui/icons/Assignment";

import { useForm } from "react-hook-form";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { useAuth } from "hooks/useAuth";
import moment from "moment";
import { SweetAlertCustom } from "./SweetAlertCustom";
require("moment/locale/es.js");

const useStylesBase = makeStyles(styles);
const useStyles = makeStyles({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
});

export default function AssetsMaintenanceReports() {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const classes = useStyles();
  const classesBase = useStylesBase();
  const { authUser } = useAuth();

  useEffect(() => {
    getReports();
  }, []);
  const hideAlert = () => {
    setAlert(null);
  };
  function getReports() {
    db.collection("asset_maintenance_report")
      .where("maintenanceDone", "==", false)
      .get()
      .then(function (list) {
        if (list) {
          const mappedData = list.docs.map((item, index) => {
            const data = item.data();
            let defaultValues = data.assetId;
            return {
              id: index,
              nombre: data.assetName,
              recursoId: data.assetId,
              fecha: moment(data.createdAt.toDate()).format("LLLL"),
              actions: (
                <div className="actions-right">
                  <Tooltip
                    title="Formulario de mantenimiento"
                    aria-label="formulario de mantenimiento"
                  >
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() => {
                        history.push({
                          pathname: `/admin/assets-maintenance/${item.id}/report`,
                          state: { detail: defaultValues },
                        });
                      }}
                      color="info"
                      className="edit"
                    >
                      <Assignment />
                    </Button>
                  </Tooltip>{" "}
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
            <h4 className={classes.cardIconTitle}>Mis dispositivos </h4>
          </CardHeader>
          <CardBody>
            <ReactTable
              columns={[
                {
                  Header: "Nombre",
                  accessor: "nombre",
                },
                {
                  Header: "Recurso id",
                  accessor: "recursoId",
                },
                {
                  Header: "Puesto en mantenimiento el:",
                  accessor: "fecha",
                },
                {
                  Header: "Acciones",
                  accessor: "actions",
                },
              ]}
              data={data}
            />
          </CardBody>
        </Card>
      </GridItem>
      {alert}
    </GridContainer>
  );
}
