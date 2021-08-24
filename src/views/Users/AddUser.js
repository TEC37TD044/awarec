import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import React, { useEffect, useState } from "react";
import { Assignment } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import FormLabel from "@material-ui/core/FormLabel";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import inputValidation from "views/Assets/inputValidation";
import CardIcon from "components/Card/CardIcon.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import stylesSelect from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import UserService from "services/userService";
import { InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import _ from "lodash";

const useStyles = makeStyles(styles);
const useStylesSelect = makeStyles(stylesSelect);
export default function AddUser() {
  const history = useHistory();
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    errors,
    reset,
    setError,
    getValues,
  } = useForm({});
  const [value, setValue] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [emails, setEmails] = useState([]);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const classesSelect = useStylesSelect();

  const onSubmit = async (data) => {
    let customData = data;
    customData.role = value;
    customData.emailVerified = false;
    customData.disabled = false;
    console.log(data);
    if (emailValid) {
      await UserService.setUser(data);
      history.push("/admin/users");
    } else {
      setError("email", {
        type: "manual",
        message: "Este email ya esta registrado",
      });
    }
  };

  useEffect(() => {
    fetchUsers(true);
  }, []);
  const fetchUsers = (update = false) => {
    UserService.getUsers(update).then(function (list) {
      if (list) {
        const mappedData = list.map((user) => {
          const { email } = user;
          return {
            email,
          };
        });
        setEmails(mappedData);
      }
    });
  };

  const handleBlurEmail = () => {
    const newEmail = getValues("email");
    const usedEmail = _.find(emails, ["email", newEmail]);
    if (!_.isEmpty(usedEmail)) {
      setEmailValid(false);
      setError("email", {
        type: "manual",
        message: "Este email ya esta registrado",
      });
    } else {
      //   clearErrors("email");
      setEmailValid(true);
    }
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose" text>
              <CardIcon color="rose">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Registrar nuevo usuario{" "}
              </h4>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Nombre *
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="help-text"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "text",
                        name: "displayName",
                      }}
                      error={errors && errors.displayName ? true : false}
                      inputRef={register(inputValidation.texto)}
                      helperText={errors && errors.displayName?.message}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Email *
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="help-text"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "email",
                        name: "email",
                        onBlur: handleBlurEmail,
                      }}
                      error={errors && errors.email ? true : false}
                      inputRef={register(inputValidation.email)}
                      helperText={errors && errors.email?.message}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Contraseña *
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="help-text"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: showPassword ? "text" : "password",
                        name: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={errors && errors.password ? true : false}
                      inputRef={register(inputValidation.password)}
                      helperText={errors && errors.password?.message}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Rol
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <FormControl
                      className={classesSelect.selectFormControl}
                      fullWidth
                    >
                      <InputLabel id="demo-simple-select-label"></InputLabel>
                      <Select
                        labelId="select"
                        id="demo-simple-select"
                        defaultValue={value}
                        value={value}
                        select
                        onChange={(e) => setValue(e.target.value, true)}
                      >
                        <MenuItem
                          value="user"
                          classes={{
                            root: classesSelect.selectMenuItem,
                          }}
                        >
                          Usuario
                        </MenuItem>
                        <MenuItem
                          value="admin"
                          classes={{
                            root: classesSelect.selectMenuItem,
                          }}
                        >
                          Administrador
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer justify="flex-end">
                  <GridItem xs={6} sm={6} md={5}>
                    <Button color="rose" type="submit">
                      Guardar
                    </Button>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={4}>
                    <Button
                      color="rose"
                      onClick={() => {
                        reset();
                        history.push("/admin/users");
                      }}
                    >
                      Cancelar
                    </Button>
                  </GridItem>
                </GridContainer>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
