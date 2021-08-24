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

const useStylesBase = makeStyles(styles);
const useStyles = makeStyles({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
});

export default function AssetRefund() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const classes = useStyles();
  const classesBase = useStylesBase();
  const history = useHistory();
  const { authUser } = useAuth();
  const warningWithConfirmMessage = (id, approved, assetId) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title={"Aceptar devolución"}
        onConfirm={() => success(id, approved, assetId)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classesBase.button + " " + classesBase.success}
        cancelBtnCssClass={classesBase.button + " " + classesBase.danger}
        confirmBtnText="Si"
        cancelBtnText="Cancelar"
        showCancel
      ></SweetAlert>
    );
  };

  const success = async (id, approved, assetId) => {
    await db
      .collection("asset_assignment")
      .doc(id)
      .update({
        refund: approved,
      })
      .then(() => {
        db.collection("assets")
          .doc(assetId)
          .update({
            assignedToName: "",
            assignedToUserId: "",
            updatedAt: new Date(),
          })
          .then(() => {
            fetchAssignments();
            setAlert(
              <SweetAlert
                success
                style={{ display: "block", marginTop: "-100px" }}
                title="Recurso fue devuelto exitosamente!"
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
  };

  const hideAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    db.collection("asset_assignment")
      .where("refund", "==", false)
      .get()
      .then(function (list) {
        // eslint-disable-next-line no-debugger
        //debugger;

        if (list) {
          const mappedData = list.docs.map((item, index) => {
            const data = item.data();
            return {
              id: index,
              email: data.email,
              nombre: data.assignedToName,
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
                      warningWithConfirmMessage(item.id, true, data.assetId)
                    }
                    color="success"
                    className="accept"
                  >
                    <CheckSharp />
                  </Button>{" "}
                  {/* use this button to remove the data row */}
                </div>
              ),
            };
          });
          setData(mappedData);
        }
      });
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <DesktopMacIcon />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>
              Registrar devolución de recurso{" "}
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
          </CardBody>
        </Card>
      </GridItem>
      {alert}
    </GridContainer>
  );
}
