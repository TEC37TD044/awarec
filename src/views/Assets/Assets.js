/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../providers/firebase";
// @material-ui/icons
// import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import AssignmentInd from "@material-ui/icons/AssignmentInd";
// import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import Build from "@material-ui/icons/Build";
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

import { dataTable } from "variables/general.js";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { useAuth } from "hooks/useAuth";
import Badge from "components/Badge/Badge";
import Tooltip from "@material-ui/core/Tooltip";

const useStylesBase = makeStyles(styles);
const useStyles = makeStyles({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
});

export default function Assets() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const classes = useStyles();
  const classesBase = useStylesBase();
  const history = useHistory();
  const { authUser } = useAuth();

  const warningWithConfirmMessage = (id) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="¿Estas seguro de eliminar este recurso?"
        onConfirm={() => successDelete(id)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classesBase.button + " " + classesBase.success}
        cancelBtnCssClass={classesBase.button + " " + classesBase.danger}
        confirmBtnText="Si"
        cancelBtnText="Cancelar"
        showCancel
      >
        No podras recuperar este recurso una vez eliminado
      </SweetAlert>
    );
  };

  const warningWithConfirmMessageMaintenced = (
    id,
    assignedToName,
    deviceUnderMaintenced,
    assetName
  ) => {
    if (!deviceUnderMaintenced) {
      if (_.isEmpty(assignedToName)) {
        setAlert(
          <SweetAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title="Colocar este recurso en mantenimiento"
            onConfirm={() => successMaintenance(id, assetName)}
            onCancel={() => hideAlert()}
            confirmBtnCssClass={classesBase.button + " " + classesBase.success}
            cancelBtnCssClass={classesBase.button + " " + classesBase.danger}
            confirmBtnText="Si"
            cancelBtnText="Cancelar"
            showCancel
          >
            Este recurso se colocara en mantenimiento y no se podra asignar
            mientras este en mantenimiento.
          </SweetAlert>
        );
      } else {
        titleAndTextAlert();
      }
    } else {
      setAlert(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title="Este dispositivo ya esta en mantenimiento"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={classesBase.button + " " + classesBase.info}
        ></SweetAlert>
      );
    }
  };

  const successDelete = async (id) => {
    await db
      .collection("assets")
      .doc(id)
      .update({
        updatedAt: new Date(),
        deleted: true,
      })
      .then(() => {
        getAssets();
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Eliminado!"
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnCssClass={classesBase.button + " " + classesBase.success}
          >
            Recurso eliminado
          </SweetAlert>
        );
        // history.go(0);
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const titleAndTextAlert = () => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="No se puede colocar en mantenimiento"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classesBase.button + " " + classesBase.info}
      >
        Este recurso no se puede colocar en mantenimiento porque esta siendo
        usado un usuario.
      </SweetAlert>
    );
  };
  const successMaintenance = async (id, assetName) => {
    await db
      .collection("asset_maintenance_report")
      .add({
        createdAt: new Date(),
        updatedAt: new Date(),
        putInMaintenanceToName: authUser.displayName,
        putInMaintenanceToUserId: authUser.uid,
        assetId: id,
        assetName: assetName,
        maintenanceDone: false,
      })
      .then(() => {
        db.collection("assets")
          .doc(id)
          .update({
            updatedAt: new Date(),
            deviceUnderMaintenced: true,
          })
          .then(() => {
            getAssets();
            setAlert(
              <SweetAlert
                success
                style={{ display: "block", marginTop: "-100px" }}
                title=" El recurso se coloco en mantenimiento!"
                onConfirm={() => hideAlert()}
                onCancel={() => hideAlert()}
                confirmBtnCssClass={
                  classesBase.button + " " + classesBase.success
                }
              ></SweetAlert>
            );
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const hideAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    getAssets();
  }, []);

  function getAssets() {
    db.collection("assets")
      .where("deleted", "==", false)
      .get()
      .then(function (list) {
        if (list) {
          const mappedData = list.docs.map((item, index) => {
            const data = item.data();
            let defaultValues = {
              name: data.name,
              description: data.description,
              make: data.make,
              model: data.model,
              serie: data.serie,
              customFields: data.customFields,
              id: item.id,
              deviceUnderMaintenced: data.deviceUnderMaintenced,
              enabledForReserved: data.enabledForReserved,
              available: data.available,
            };
            const badgeSetting = getBadge(
              data.deviceUnderMaintenced,
              data.available,
              data.assignedToName
            );
            return {
              id: index,
              nombre: (
                <>
                  {data.name}
                  <br />
                  {badgeSetting.show && (
                    <>
                      <Badge color={badgeSetting.color}>
                        {badgeSetting.message}
                      </Badge>
                    </>
                  )}
                </>
              ),
              descripcion: data.description,
              marca: data.make,
              modelo: data.model,
              //serial: item.id,
              serial: data.serie,
              actions: (
                <div className="actions-right">
                  <Tooltip title="editar recurso">
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() => {
                        history.push({
                          pathname: `/admin/assets/${item.id}`,
                          state: { detail: defaultValues },
                        });
                      }}
                      color="warning"
                      className="edit"
                    >
                      <Dvr />
                    </Button>
                  </Tooltip>{" "}
                  <Tooltip title="asignar recurso a un usuario">
                    <Button
                      justIcon
                      round
                      simple
                      disabled={
                        !_.isEmpty(data.assignedToName) ||
                        !data.available ||
                        data.deviceUnderMaintenced
                      }
                      onClick={() => {
                        history.push({
                          pathname: `/admin/assets/${item.id}/assign`,
                          state: { detail: data.name },
                        });
                      }}
                      color="primary"
                      className="edit"
                    >
                      <AssignmentInd />
                    </Button>
                  </Tooltip>{" "}
                  {/* use this button to remove the data row */}
                  <Tooltip title="colocar recurso en mantenimiento">
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() =>
                        warningWithConfirmMessageMaintenced(
                          item.id,
                          data.assignedToName,
                          data.deviceUnderMaintenced,
                          data.name
                        )
                      }
                      color="info"
                      className="maintenance"
                    >
                      <Build />
                    </Button>
                  </Tooltip>{" "}
                  <Tooltip title="eliminar recurso">
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() => warningWithConfirmMessage(item.id)}
                      color="danger"
                      className="remove"
                    >
                      <Close />
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

  function getBadge(deviceUnderMaintenced, available, assignedToName) {
    let result = {};
    if (deviceUnderMaintenced) {
      result = {
        message: "En mantenimiento",
        color: "info",
        show: true,
      };
    } else if (!available) {
      result = {
        message: "De baja no disponible",
        color: "danger",
        show: true,
      };
    } else if (!_.isEmpty(assignedToName)) {
      result = {
        message: "Dispositivo asignado",
        color: "success",
        show: true,
      };
    } else {
      result = {
        message: "",
        color: "",
        show: false,
      };
    }
    return result;
  }
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <DesktopMacIcon />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>
              Recursos Electronicos{" "}
              <Button
                color="primary"
                onClick={() => {
                  history.push("/admin/asset-new");
                }}
              >
                Agregar
              </Button>
            </h4>
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
                    Header: "Descripción",
                    accessor: "descripcion",
                  },
                  {
                    Header: "Marca",
                    accessor: "marca",
                  },
                  {
                    Header: "Modelo",
                    accessor: "modelo",
                  },
                  {
                    Header: "Serial",
                    accessor: "serial",
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
