import React, { useEffect, useState } from "react";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { db } from "../../providers/firebase";

import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import { makeStyles } from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import {
  cardTitle,
  roseColor,
} from "assets/jss/material-dashboard-pro-react.js";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0",
  },
  cardCategoryWhite: {
    margin: "0",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: ".875rem",
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px",
  },
  icon: {
    color: "#333333",
    margin: "10px auto 0",
    width: "130px",
    height: "130px",
    border: "1px solid #E5E5E5",
    borderRadius: "50%",
    lineHeight: "174px",
    "& svg": {
      width: "55px",
      height: "55px",
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "55px",
      fontSize: "55px",
    },
  },
  iconRose: {
    color: roseColor,
  },
  marginTop30: {
    marginTop: "30px",
  },
  testimonialIcon: {
    marginTop: "30px",
    "& svg": {
      width: "40px",
      height: "40px",
    },
  },
  cardTestimonialDescription: {
    fontStyle: "italic",
    color: "#999999",
  },
});

function AvailableAssets() {
  const [data, setData] = useState([]);
  const history = useHistory();
  useEffect(() => {
    db.collection("assets")
      .where("deleted", "==", false)
      .get()
      .then(function (list) {
        if (list) {
          const mappedData = list.docs
            .filter((it) => {
              const datafilter = it.data();
              if (
                datafilter.available &&
                datafilter.enabledForReserved &&
                !datafilter.deviceUnderMaintenced &&
                !datafilter.deleted
              ) {
                return true;
              } else {
                return false;
              }
            })
            .map((item) => {
              const data = item.data();
              // eslint-disable-next-line no-debugger
              //debugger;

              return {
                id: item.id,
                nombre: data.name,
                descripcion: data.description,
                marca: data.make,
                modelo: data.model,
                serial: data.serie,
                deviceUnderMaintenced: data.deviceUnderMaintenced,
                available: data.available,
                enabledForReserved: data.enabledForReserved,
              };
            });

          setData(mappedData);
        }
      });
  }, []);

  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <EventAvailableIcon />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Reservar recurso</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              {data.map(({ id, nombre, descripcion, marca, modelo }) => (
                <GridItem key={id} xs={12} sm={6} lg={4}>
                  <Card>
                    <CardHeader>
                      <h3>
                        {marca} {modelo}
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <p className={classes.cardDescription}>
                        {nombre} - {descripcion}
                      </p>
                      <Button
                        round
                        color="rose"
                        onClick={() => {
                          history.push({
                            pathname: `/admin/request-asset/${id}`,
                          });
                        }}
                      >
                        Reservar
                      </Button>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default AvailableAssets;
