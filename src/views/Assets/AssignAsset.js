/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../providers/firebase";
// @material-ui/icons
// import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import CheckSharp from "@material-ui/icons/CheckSharp";
// import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
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
import moment from "moment";
require("moment/locale/es.js");
import { dataTable } from "variables/general.js";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useHistory } from "react-router-dom";
import Firebase from "firebase/app";
import { useAuth } from "hooks/useAuth";
import _ from "lodash";

const useStylesBase = makeStyles(styles);
const useStyles = makeStyles({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
});

export default function AssignAsset() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const classes = useStyles();
  const classesBase = useStylesBase();
  const { authUser } = useAuth();
  const history = useHistory();

  const success = async (id, approved, data) => {
    let currentTime = new Date();
    if (approved) {
      data.assignedAt = currentTime;
      data.assignedBy = authUser.displayName;
      await db
        .collection("asset_assignment")
        .add(data)
        .then((result) => {
          db.collection("asset_booking")
            .doc(id)
            .update({
              requestAnswered: true,
              assetAssigmentId: result.id,
              updatedAt: currentTime,
              status: "aprobado",
            })
            .then(() => {
              db.collection("assets")
                .doc(data.assetId)
                .update({
                  assignedToName: data.assignedToName,
                  assignedToUserId: data.assignedToUserId,
                })
                .then(() => {
                  fetchAssets();
                  setAlert(
                    <SweetAlert
                      success
                      style={{ display: "block", marginTop: "-100px" }}
                      title="Recurso asignado correctamente!"
                      onConfirm={() => hideAlert()}
                      onCancel={() => hideAlert()}
                      confirmBtnCssClass={
                        classesBase.button + " " + classesBase.success
                      }
                    ></SweetAlert>
                  );
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    } else {
      await db
        .collection("asset_booking")
        .doc(id)
        .update({
          requestAnswered: true,
          updatedAt: currentTime,
          status: "rechazado",
        })
        .then(() => {
          fetchAssets();
          setAlert(
            <SweetAlert
              success
              style={{ display: "block", marginTop: "-100px" }}
              title="La solicitud del recurso electronico fue rechazada correctamente!"
              onConfirm={() => hideAlert()}
              onCancel={() => hideAlert()}
              confirmBtnCssClass={
                classesBase.button + " " + classesBase.success
              }
            ></SweetAlert>
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const hideAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = () => {
    db.collection("assets")
      .get()
      .then(function (list) {
        // eslint-disable-next-line no-debugger
        //debugger;

        if (list) {
          const assetsData = list.docs.map((item, index) => {
            const data = item.data();
            return {
              name: data.name,
              id: item.id,
              assignedToName: data.assignedToName,
              deleted: data.deleted,
            };
          });
          getAssetsBokingRows(assetsData);
        }
      });
  };

  const warningWithConfirmMessage = async (id, approved, data, assetssData) => {
    let result = _.filter(assetssData, { id: data.assetId });

    if (!approved || _.isEmpty(result[0].assignedTo)) {
      setAlert(
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title={approved ? "Aceptar Solicitud" : "Rechazar Solicitud"}
          onConfirm={() => success(id, approved, data)}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={classesBase.button + " " + classesBase.success}
          cancelBtnCssClass={classesBase.button + " " + classesBase.danger}
          confirmBtnText="Si"
          cancelBtnText="Cancelar"
          showCancel
        ></SweetAlert>
      );
    } else {
      setAlert(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title="No es posible asignar este recurso porque ya esta asignado!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={classesBase.button + " " + classesBase.success}
        />
      );
      // history.go(0);
    }
  };

  function getAssetsBokingRows(assetssData) {
    let currentTime = Firebase.firestore.Timestamp.fromDate(
      new Date(new Date() - 86400000)
    );
    db.collection("asset_booking")
      .where("from", ">=", currentTime)
      .where("requestAnswered", "==", false)
      .get()
      .then(function (list) {
        if (list) {
          const mappedData = list.docs
            .filter((item) => {
              let data = item.data();
              let result = _.filter(assetssData, { id: data.assetId });
              if (!result[0].deleted) {
                return true;
              } else {
                return false;
              }
            })
            .map((item, index) => {
              const data = item.data();
              const sendData = {
                assetId: data.assetId,
                assetName: data.assetName,
                createdBy: data.createdBy,
                email: data.email,
                from: data.from,
                reasons: data.reasons,
                to: data.to,
                assignedToUserId: data.uid,
                assignedToName: data.fullName,
                refund: false,
              };
              return {
                id: index,
                nombre: data.fullName,
                email: data.email,
                razon: data.reasons,
                recurso: data.assetName,
                fechainicio: moment(data.from.toDate()).format("LLLL"),
                fechafin: moment(data.to.toDate()).format("LLLL"),
                actions: (
                  <div className="actions-right">
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() =>
                        warningWithConfirmMessage(
                          item.id,
                          true,
                          sendData,
                          assetssData
                        )
                      }
                      color="success"
                      className="accept"
                    >
                      <CheckSharp />
                    </Button>{" "}
                    {/* use this button to remove the data row */}
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() =>
                        warningWithConfirmMessage(
                          item.id,
                          false,
                          sendData,
                          assetssData
                        )
                      }
                      color="danger"
                      className="remove"
                    >
                      <Close />
                    </Button>{" "}
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
            <h4 className={classes.cardIconTitle}>Reservas Pendientes </h4>
          </CardHeader>
          <CardBody>
            {!_.isEmpty(data) && (
              <ReactTable
                columns={[
                  {
                    Header: "Nombre",
                    accessor: "nombre",
                  },
                  {
                    Header: "Email",
                    accessor: "email",
                  },
                  {
                    Header: "Razón",
                    accessor: "razon",
                  },
                  {
                    Header: "Recurso",
                    accessor: "recurso",
                  },
                  {
                    Header: "Desde",
                    accessor: "fechainicio",
                  },
                  {
                    Header: "Hasta",
                    accessor: "fechafin",
                  },
                  {
                    Header: "Acciones",
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
