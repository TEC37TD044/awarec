/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../providers/firebase";
// @material-ui/icons
// import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
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

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useHistory } from "react-router-dom";
import UserService from "../../services/userService";
import * as _ from "lodash";
import moment from "moment";
require("moment/locale/es.js");

const useStylesBase = makeStyles(styles);
const useStyles = makeStyles({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
});

export default function Users() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const classes = useStyles();
  const classesBase = useStylesBase();
  const history = useHistory();
  const warningWithConfirmMessage = (id) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="¿Estas seguro de eliminar este usuario?"
        onConfirm={() => successDelete(id)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classesBase.button + " " + classesBase.success}
        cancelBtnCssClass={classesBase.button + " " + classesBase.danger}
        confirmBtnText="Si"
        cancelBtnText="Cancelar"
        showCancel
      >
        No podras recuperar este usuario una vez eliminado
      </SweetAlert>
    );
  };

  const successDelete = async (id) => {
    UserService.deleteUser(id)
      .then(() => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Eliminado!"
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnCssClass={classesBase.button + " " + classesBase.success}
          >
            Usuario eliminado
          </SweetAlert>
        );
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const hideAlert = () => {
    setAlert(null);
    fetchUsers(true);
  };

  const fetchUsers = (update = false) => {
    UserService.getUsers(update).then(function (list) {
      if (list) {
        const mappedData = list.map((user, index) => {
          const { uid, email, displayName, metadata, customClaims } = user;
          return {
            id: uid,
            nombre: displayName,
            correo: email,
            rol: _.get(customClaims, "role", "user"),
            fechaCreacion: moment(
              _.get(metadata, "lastSignInTime", null)
            ).format("LLLL"),
            fechaLogin: moment(_.get(metadata, "creationTime", null)).format(
              "LLLL"
            ),
            actions: (
              <div className="actions-right">
                <Button
                  justIcon
                  round
                  simple
                  // onClick={() => {
                  //   history.push({
                  //     pathname: `/admin/asset-update/${index}`,
                  //     state: { detail: defaultValues },
                  //   });
                  // }}
                  color="warning"
                  className="edit"
                  onClick={() => {
                    history.push({
                      pathname: `/admin/users/${uid}`,
                    });
                  }}
                >
                  <Dvr />
                </Button>{" "}
                {/* use this button to remove the data row */}
                <Button
                  justIcon
                  round
                  simple
                  onClick={() => warningWithConfirmMessage(uid)}
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
  };

  useEffect(() => {
    fetchUsers(true);
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <DesktopMacIcon />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>
              Usuarios Registrados{" "}
              <Button
                color="primary"
                onClick={() => {
                  history.push("/admin/user-new");
                }}
              >
                Nuevo usuario
              </Button>
            </h4>
          </CardHeader>
          <CardBody>
            <ReactTable
              columns={[
                {
                  Header: "Nombre",
                  accessor: "nombre",
                },
                {
                  Header: "Correo",
                  accessor: "correo",
                },
                {
                  Header: "Rol",
                  accessor: "rol",
                },
                {
                  Header: "Fecha Creacion",
                  accessor: "fechaCreacion",
                },
                {
                  Header: "Ultimo Ingreso",
                  accessor: "fechaLogin",
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
