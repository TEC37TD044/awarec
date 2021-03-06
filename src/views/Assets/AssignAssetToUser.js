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
import { makeStyles, createStyles } from "@material-ui/core";
import { db } from "../../providers/firebase";
import Table from "components/Table/Table.js";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";

import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import moment from "moment";
require("moment/locale/es.js");
//import { events as calendarEvents } from "variables/general.js";
import SweetAlert from "react-bootstrap-sweetalert";
import styles from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";
import { useAuth } from "hooks/useAuth";
import { useHistory } from "react-router-dom";
import Firebase from "firebase/app";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Search from "@material-ui/icons/Search";
import Tooltip from "@material-ui/core/Tooltip";
import _ from "lodash";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Popper from "@material-ui/core/Popper";
import Muted from "components/Typography/Muted";
import InputAdornment from "@material-ui/core/InputAdornment";
import stylesIcon from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";
import { grey } from "@material-ui/core/colors";
import UserService from "../../services/userService";

const localizer = momentLocalizer(moment);

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

const useStylesBase = makeStyles(stylesIcon);

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    maxWidth: 220,
  },
}));

function CustomToolTip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow placement="top" classes={classes} {...props} />;
}

function AssignAssetToUser() {
  const { id } = useParams();
  const classes = useStyles();
  const classesBase = useStylesBase();
  const [data, setData] = useState([]);
  const [events, setEvents] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [viewState, setViewState] = useState("month");
  const [disabled, setDisabled] = React.useState(true);
  const history = useHistory();
  const { authUser } = useAuth();
  const [dataa, setDataa] = useState([]);
  const [value, setValue] = useState(null);

  useEffect(() => {
    db.collection("assets")
      .doc(id)
      .get()
      .then(function (item) {
        const asset = item.data();
        const data = [
          ["C??digo", item.id],
          ["Nombre", asset.name],
          ["Marca", asset.make],
          ["Modelo", asset.model],
          ["N??mero Serie", asset.serie],
          ["Descripci??n", asset.description],
        ];
        if (asset.customFields) {
          asset.customFields.forEach((field) => {
            data.push([field.name, field.value]);
          });
        }
        setData(data);
      });

    let currentTime = Firebase.firestore.Timestamp.fromDate(
      new Date(moment().year(), moment().month() - 1, moment().date())
    );
    db.collection("asset_assignment")
      .where("assetId", "==", id)
      .where("from", ">=", currentTime)
      .get()
      .then(function (list) {
        if (list) {
          const calendarEvents = list.docs.map((item) => {
            const data = item.data();
            return {
              title: data.reasons,
              start: moment(data.from.toDate()).toDate(),
              end: moment(data.to.toDate()).toDate(),
              color: "azure",
              newEvent: false,
            };
          });
          setEvents(calendarEvents);
          setCount(0);
        }
      });
  }, []);

  useEffect(() => {
    fetchUsers(true);
  }, []);

  const fetchUsers = (update = false) => {
    UserService.getUsers(update).then(function (list) {
      if (list) {
        const mappedData = list.map((user) => {
          const { uid, email, displayName } = user;
          return {
            id: uid,
            displayName,
            email,
          };
        });
        setDataa(mappedData);
      }
    });
  };
  const eventColors = (event) => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor,
    };
  };
  const [alert, setAlert] = React.useState(null);
  // const selectedEvent = (event) => {
  //   window.alert(event.title);
  // };
  const addNewEventAlert = (slotInfo) => {
    setAlert(
      <SweetAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Agrega la raz??n de tu reserva"
        onConfirm={(e) => addNewEvent(e, slotInfo)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
      />
    );
  };
  const addNewEvent = (e, slotInfo) => {
    if (validateCurrentDate(slotInfo.start)) {
      var newEvents = events;
      let valid = validateDateRange(slotInfo.start, slotInfo.end, newEvents);

      let end;
      let start;

      switch (viewState) {
        case "month":
          start = slotInfo.start;
          end = new Date(slotInfo.end.getTime() + 1000);
          break;
        case "week":
          start = slotInfo.start;
          end = new Date(slotInfo.end.getTime() + 1000);
          break;
        case "day":
          start = slotInfo.start;
          end = slotInfo.end;
          break;
      }

      if (valid) {
        newEvents.push({
          title: e,
          start: start,
          end: end,
          // start: slotInfo.start,
          // end: new Date(slotInfo.end.getTime() + 1000),
          color: "green",
          newEvent: true,
          id: count,
          allDay: false,
        });
        setCount(count + 1);
        setAlert(null);
        setEvents(newEvents);
      } else {
        basicAlert(
          "El recurso ya esta asignado en esta fecha, porfavor coloca otra fecha"
        );
      }
    } else {
      basicAlert("Porfavor, introduce una fecha actual");
    }
  };

  const validateCurrentDate = (start) => {
    let result = true;
    let currentTime = new Date().getTime() - 86400000;
    if (currentTime >= start.getTime()) {
      result = false;
    }
    return result;
  };
  const validateDateRange = (start, end, eventss) => {
    let result = true;
    for (const event of eventss) {
      if (
        event.start.getTime() <= end.getTime() &&
        event.end.getTime() >= start.getTime()
      ) {
        result = false;
        break;
      }
    }
    return result;
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const editNewEventTitle = (eventId, title) => {
    setAlert(
      <SweetAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Editar la raz??n de tu reserva"
        defaultValue={title}
        onConfirm={(e) => {
          editTitle(e, eventId);
        }}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
      />
    );
  };

  const editTitle = (e, eventId) => {
    const currentEvents = events;

    for (const event of currentEvents) {
      if (event.id !== undefined) {
        if (event.id === eventId) {
          event.title = e;
        }
      }
      setAlert(null);
      setEvents(currentEvents);
    }
  };

  const removeEvent = (eventId) => {
    const currentEvents = events;
    let updated = _.reject(currentEvents, function (el) {
      return el.id === eventId;
    });
    setEvents(updated);
  };

  const basicAlert = (title) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={title}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
      />
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newEvent = [];

    for (const event of events) {
      if (event?.newEvent) {
        newEvent.push(event);
      }
    }
    if (_.isEmpty(value)) {
      basicAlert("Seleciona al usuario para asignar el recurso");
    } else if (_.size(newEvent) === 0) {
      basicAlert("Introduce una fecha para reservar este recurso");
    } else if (_.size(newEvent) > 1) {
      basicAlert(
        "Tienes demasiadas fechas reservadas en el calendario, solo puedes hacer una reserva"
      );
    } else {
      let assigmentData = {
        assetId: data[0][1],
        assetName: data[1][1],
        createdBy: authUser.email,
        email: value.email,
        from: newEvent[0].start,
        to: newEvent[0].end,
        reasons: newEvent[0].title,
        assignedToUserId: value.id,
        assignedToName: value.displayName,
        refund: false,
        assignedAt: new Date(),
        assignedBy: authUser.displayName,
      };
      let bokingData = {
        uid: value.id,
        fullName: value.displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: authUser.email,
        email: value.email,
        reasons: newEvent[0].title,
        from: newEvent[0].start,
        to: newEvent[0].end,
        assetId: data[0][1],
        assetName: data[1][1],
        requestAnswered: true,
        status: "aprobado",
        // assetAssigmentId: docRef.id,
      };
      let assetData = {
        assignedToUserId: value.id,
        assignedToName: value.displayName,
      };

      await db
        .collection("asset_assignment")
        .add(assigmentData)
        .then((docRef) => {
          bokingData.assetAssigmentId = docRef.id;
          db.collection("asset_booking")
            .add(bokingData)
            .then(() => {
              db.collection("assets")
                .doc(id)
                .update(assetData)
                .then(() => {
                  setEvents([]);
                  setCount(0);
                  history.push("/admin/assets");
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      let view = viewState;
      let mDate = toolbar.date;
      let newDate;
      if (view === "month") {
        newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1);
      } else if (view === "week") {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() - 7,
          1
        );
      } else {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() - 1,
          1
        );
      }
      if (view === "month" && mDate.getMonth() === moment().month() + 1) {
        setDisabled(true);
      } else if (view === "week" && mDate.getDate() === moment().date() + 7) {
        setDisabled(true);
      } else if (view === "day" && mDate.getDate() === moment().date() + 1) {
        setDisabled(true);
      }
      toolbar.onNavigate("PREV");
    };
    const goToNext = () => {
      let view = viewState;
      let mDate = toolbar.date;
      let newDate;
      if (view === "month") {
        newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1);
      } else if (view === "week") {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() + 7,
          1
        );
      } else {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() + 1,
          1
        );
      }

      if (view === "month") {
        setDisabled(false);
      } else if (view === "day") {
        setDisabled(false);
      } else if (view === "week") {
        setDisabled(false);
      }
      toolbar.onNavigate("NEXT");
    };
    const goToCurrent = () => {
      toolbar.onNavigate("TODAY");
      setViewState("day");
    };

    const goToMonth = () => {
      toolbar.onView("month");
      setViewState("month");
    };

    const goToWeek = () => {
      toolbar.onView("week");
      setViewState("week");
    };

    const goToDay = () => {
      toolbar.onView("day");
      setViewState("day");
    };

    // const goToAgenda = () => {
    //   toolbar.onView("agenda");
    //   setViewState("agenda");
    // };
    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span style={{ textTransform: "capitalize" }}>
          {date.format("MMMM")}
          <span> {date.format("YYYY")}</span>
        </span>
      );
    };

    const lowerCase = { textTransform: "none" };

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <Button onClick={goToBack} disabled={disabled} style={lowerCase}>
            anterior
          </Button>
          <Button type="button" onClick={goToCurrent} style={lowerCase}>
            hoy
          </Button>
          <Button type="button" onClick={goToNext} style={lowerCase}>
            siguiente
          </Button>
        </span>
        <span className="rbc-toolbar-label">{label()}</span>
        <span className="rbc-btn-group">
          <Button type="button" onClick={goToMonth} style={lowerCase}>
            Mes
          </Button>
          <Button type="button" onClick={goToWeek} style={lowerCase}>
            Semana
          </Button>
          <Button type="button" onClick={goToDay} style={lowerCase}>
            D??a
          </Button>
          {/* <Button type="button" onClick={goToAgenda} style={lowerCase}>
            Agenda
          </Button> */}
        </span>
      </div>
    );
  };

  const Event = ({ event }) => {
    return (
      <>
        {event.newEvent && (
          <>
            {" "}
            <Button
              justIcon
              simple
              color="primary"
              onClick={() => editNewEventTitle(event.id, event.title)}
              className={classes.buttonIcon}
            >
              <Edit />
            </Button>
            <Button
              justIcon
              simple
              color="danger"
              onClick={() => removeEvent(event.id)}
              className={classes.buttonIcon}
            >
              <Delete />
            </Button>
          </>
        )}

        <CustomToolTip title={<>{event.title}</>}>
          <span>{event.title}</span>
        </CustomToolTip>
      </>
    );
  };
  return (
    <GridContainer style={{ textAlign: "initial" }}>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <EventAvailableIcon />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Asignar recurso</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4} lg={3}>
                <form onSubmit={handleSubmit}>
                  <Button round color="primary" type="submit">
                    Asignar
                  </Button>
                  <Button
                    round
                    color="primary"
                    onClick={() => {
                      setEvents([]);
                      setCount(0);
                      history.push("/admin/assets");
                    }}
                  >
                    Cancelar
                  </Button>
                </form>
                <h3>Caracter??sticas</h3>
                <Table hover tableHeaderColor="warning" tableData={data} />
              </GridItem>
              <GridItem xs={12} sm={12} md={8} lg={9}>
                <Card>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <Autocomplete
                        id="custom-autocomplete"
                        options={dataa}
                        value={value}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                        }}
                        style={{ width: "98%", margin: 20 }}
                        getOptionLabel={(option) =>
                          `${option.displayName}, ${option.email}`
                        } //filter value
                        getOptionSelected={(option, value) =>
                          option.displayName === value.displayName
                        }
                        renderInput={(params) => {
                          params.InputProps.startAdornment = (
                            <>
                              <InputAdornment position="start">
                                <Search
                                  className={
                                    classesBase.headerLinksSvg +
                                    " " +
                                    classesBase.searchIcon
                                  }
                                  style={{ color: grey[500] }}
                                />
                              </InputAdornment>
                            </>
                          );

                          return (
                            <TextField
                              fullWidth
                              placeholder="Buscar usuario"
                              {...params}
                            />
                          );
                        }}
                        renderOption={(option) => {
                          return (
                            <Muted>{`${option.displayName}, ${option.email}`}</Muted>
                          ); //display value
                        }}
                        // PopperComponent={CustomPopper} //required (as far as I can tell) in order to target popper elements for custom styling
                      />
                    </GridItem>
                  </GridContainer>

                  <CardBody calendar>
                    {alert}
                    <BigCalendar
                      components={{
                        toolbar: CustomToolbar,
                        event: Event,
                      }}
                      selectable
                      localizer={localizer}
                      events={events}
                      defaultView="month"
                      scrollToTime={new Date()}
                      defaultDate={new Date()}
                      //onSelectEvent={(event) => selectedEvent(event)}
                      onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
                      eventPropGetter={eventColors}
                      timeslots={2}
                      culture={"es"}
                      messages={{
                        agenda: "Agenda",
                        allDay: "todo el dia",
                        month: "Mes",
                        day: "Dia",
                        today: "hoy",
                        previous: "anterior",
                        next: "proximo",
                        date: "fecha",
                        noEventsInRange:
                          "No se encontraron eventos en esta fecha",
                        time: "tiempo",
                        tomorrow: "ma??ana",
                        week: "Semana",
                        work_week: "Semana de trabajo",
                        yesterday: "Ayer",
                      }}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default AssignAssetToUser;
AssignAssetToUser.propTypes = {
  event: PropTypes.object,
};
