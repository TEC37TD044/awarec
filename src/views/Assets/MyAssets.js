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

export default function MyAssets() {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const classes = useStyles();
  const classesBase = useStylesBase();
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser && authUser.uid) {
      const userId = authUser?.uid;
      getMyAssets(userId);
    }
  }, [authUser]);
  const hideAlert = () => {
    setAlert(null);
  };
  const onConfirmSubmit = async (data) => {
    // let customData = {
    //   descripcion: data.description,
    //   titulo: data.title,
    //   reportadoPor: authUser.uid,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   estado: "OPENED",
    // };

    data.reportadoPor = authUser.uid;
    data.createdAt = new Date();
    data.updatedAt = new Date();
    data.estado = "OPENED";

    await db
      .collection("asset_failure_report")
      .add(data)
      .then(() => {
        setAlert(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function getMyAssets(uid) {
    db.collection("asset_assignment")
      .where("assignedToUserId", "==", uid)
      .get()
      .then(function (list) {
        if (list) {
          const mappedData = list.docs.map((item, index) => {
            const data = item.data();
            let defaultValues = data.assetName;
            return {
              id: index,
              nombre: data.assetName,
              desde: moment(data.from.toDate()).format("LLLL"),
              hasta: moment(data.to.toDate()).format("LLLL"), //.format("YYYY-DD-MM HH:mm"),
              devuelto: data.refund ? "Si" : "No",
              actions: (
                <div className="actions-right">
                  {/* <Tooltip title="Custom" aria-label="Custom">
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() => {
                        setAlert(
                          <SweetAlertCustom
                            hideAlert={hideAlert}
                            onConfirmSubmit={onConfirmSubmit}
                          />
                        );
                      }}
                      color="danger"
                      className="customm"
                    >
                      <Report />
                    </Button>
                  </Tooltip>{" "} */}
                  <Tooltip
                    title="Ver características"
                    aria-label="características"
                  >
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() => {
                        history.push({
                          pathname: `/admin/my-assets/${data.assetId}`,
                        });
                      }}
                      color="warning"
                      className="edit"
                    >
                      <Dvr />
                    </Button>
                  </Tooltip>{" "}
                  <Tooltip title="Reportar falla" aria-label="reportarfallas">
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() => {
                        history.push({
                          pathname: `/admin/my-assets/${data.assetId}/report`,
                          state: { detail: defaultValues },
                        });
                      }}
                      color="danger"
                      className="edit"
                    >
                      <Report />
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
                  Header: "Desde",
                  accessor: "desde",
                },
                {
                  Header: "Hasta",
                  accessor: "hasta",
                },
                {
                  Header: "Devuelto",
                  accessor: "devuelto",
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
