/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import React, { useEffect, useState } from "react";
import ChartistGraph from "react-chartist";
import { makeStyles } from "@material-ui/core/styles";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import StorageService from "../../services/storageService";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/es";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import _ from "lodash";
import moment from "moment";

const useStyles = makeStyles(styles);
const formatter = buildFormatter(frenchStrings);

export default function Dashboard() {
  const classes = useStyles();
  const [assetsMetadata, setAssetsMetadata] = useState({});
  const [chartsData, setChartsData] = useState({});
  useEffect(async () => {
    const assets = await StorageService.getAssets();
    const assigments = await StorageService.getAssigments();
    setAssetsMetadata({
      available: _.filter(assets, { deleted: false }).length,
      assigned: _.filter(
        assets,
        (a) => !_.isEmpty(a.assignedToUserId) && a.deleted === false
      ).length,
      disabled: _.filter(assets, { available: false, deleted: false }).length,
    });
    const mappedAssets = mapToAssetsChartData(assets);
    const mappedAssigments = mapToAssetAssigmentChartData(assigments);
    const mappedDisabled = mapToDisabledResources(
      assets,
      mappedAssigments.labels
    );
    setChartsData({
      assets: mappedAssets,
      assigments: mappedAssigments,
      disabled: mappedDisabled,
      available: mapToAvailableResources(mappedAssets, mappedDisabled),
    });
  }, []);

  const mapToAssetsChartData = (assets) => {
    const data = {
      labels: [],
      series: [[]],
    };
    const assetsFilter = _.filter(assets, { deleted: false });
    let groupedData = _.chain(assetsFilter)
      .groupBy((record) => moment(record.createdAt.toDate()).format("MM/YYYY"))
      .value();
    Object.keys(groupedData)
      .sort()
      .forEach((label) => {
        data.labels.push(label);
        data.series[0].push(groupedData[label].length);
      });
    return data;
  };

  const mapToAssetAssigmentChartData = (assigments) => {
    const data = {
      labels: [],
      series: [[]],
    };
    let groupedData = _.chain(assigments)
      .groupBy((record) => moment(record.assignedAt.toDate()).format("MM/YYYY"))
      .value();
    Object.keys(groupedData)
      .sort()
      .forEach((label) => {
        data.labels.push(label);
        data.series[0].push(groupedData[label].length);
      });
    return data;
  };

  const mapToDisabledResources = (assets, labels) => {
    const data = {
      labels: [],
      series: [[]],
    };
    const assetsFilter = _.filter(assets, { available: false, deleted: false });
    let groupedData = _.chain(assetsFilter)
      .groupBy((record) => moment(record.createdAt.toDate()).format("MM/YYYY"))
      .value();
    labels.sort().forEach((label) => {
      data.labels.push(label);
      data.series[0].push(_.get(groupedData[label], "length", 0));
    });
    return data;
  };

  const mapToAvailableResources = (mappedAssets, mappedDisabled) => {
    const serie = [];
    mappedAssets.series[0].forEach((value, index) => {
      serie.push(value - mappedDisabled.series[0][index]);
    });
    const data = {
      labels: mappedDisabled.labels,
      series: [serie],
    };
    console.log(data);
    return data;
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <ExitToAppIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Entregados</p>
              <h3 className={classes.cardTitle}>{assetsMetadata.assigned}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  3 Reportes de fallas
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <EventAvailableIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Disponibles</p>
              <h3 className={classes.cardTitle}>
                {assetsMetadata.available -
                  assetsMetadata.assigned -
                  assetsMetadata.disabled}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Actualizado hace 1 minuto
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <DesktopAccessDisabledIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Inhabilitados</p>
              <h3 className={classes.cardTitle}>{assetsMetadata.disabled}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Actualizado hace 1 minuto
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <DesktopMacIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Recursos</p>
              <h3 className={classes.cardTitle}>{assetsMetadata.available}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Ultimo registro hace 7 dia(s)
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="info" className={classes.cardHeaderHover}>
              {!_.isEmpty(chartsData) && (
                <ChartistGraph
                  className="ct-chart-white-colors"
                  data={chartsData.assets}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              )}
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Registro de Recursos</h4>
              <p className={classes.cardCategory}>
                Acumulacion de recursos registrados por mes
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Actualizado&nbsp;
                <TimeAgo date={new Date()} formatter={formatter} />
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="warning" className={classes.cardHeaderHover}>
              {!_.isEmpty(chartsData) && (
                <ChartistGraph
                  className="ct-chart-white-colors"
                  data={chartsData.assigments}
                  type="Line"
                  options={emailsSubscriptionChart.options}
                  listener={emailsSubscriptionChart.animation}
                />
              )}
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Recursos entregados</h4>
              <p className={classes.cardCategory}>
                Recursos que fueron entregados y/o prestados temporalmente
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Actualizado&nbsp;
                <TimeAgo date={new Date()} formatter={formatter} />
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="danger" className={classes.cardHeaderHover}>
              {!_.isEmpty(chartsData) && (
                <ChartistGraph
                  className="ct-chart-white-colors"
                  data={chartsData.disabled}
                  type="Line"
                  options={completedTasksChart.options}
                  listener={completedTasksChart.animation}
                />
              )}
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Bajas de recursos</h4>
              <p className={classes.cardCategory}>
                Recursos deshabilitados agrupados por mes
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Actualizado&nbsp;
                <TimeAgo date={new Date()} formatter={formatter} />
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success" className={classes.cardHeaderHover}>
              {!_.isEmpty(chartsData) && (
                <ChartistGraph
                  className="ct-chart-white-colors"
                  data={chartsData.available}
                  type="Line"
                  options={completedTasksChart.options}
                  listener={completedTasksChart.animation}
                />
              )}
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Disponibilidad</h4>
              <p className={classes.cardCategory}>
                Recursos disponibles agrupados por mes
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Actualizado&nbsp;
                <TimeAgo date={new Date()} formatter={formatter} />
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
