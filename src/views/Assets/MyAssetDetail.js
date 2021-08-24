/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import { makeStyles } from "@material-ui/core";
import { db } from "../../providers/firebase";
import Table from "components/Table/Table.js";

import DesktopMacIcon from "@material-ui/icons/DesktopMac";
//import { events as calendarEvents } from "variables/general.js";
import styles from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";
import { useHistory } from "react-router-dom";
import _ from "lodash";

const useStyles = makeStyles({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  buttonIcon: {
    margin: "0px",
    padding: "0px",
    border: "0px",
    width: "20px",
    height: "24px",
    minWidth: "16px",
  },
  cardTitle,
  ...styles,
});

function MyAssetDetail() {
  const { id } = useParams();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const history = useHistory();
  useEffect(() => {
    db.collection("assets")
      .doc(id)
      .get()
      .then(function (item) {
        const asset = item.data();
        const data = [
          ["Código", item.id],
          ["Nombre", asset.name],
          ["Marca", asset.make],
          ["Modelo", asset.model],
          ["Número Serie", asset.serie],
          ["Descripción", asset.description],
        ];
        if (asset.customFields) {
          asset.customFields.forEach((field) => {
            data.push([field.name, field.value]);
          });
        }
        setData(data);
      });
  }, []);

  return (
    <GridContainer style={{ textAlign: "initial" }}>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <DesktopMacIcon />
            </CardIcon>
            <h4 className={classes.cardIconTitle}></h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4} lg={3}>
                <Button
                  round
                  color="primary"
                  onClick={() => {
                    history.push("/admin/my-assets");
                  }}
                >
                  Volver
                </Button>
                <h3>Características</h3>
                <Table hover tableHeaderColor="warning" tableData={data} />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default MyAssetDetail;
