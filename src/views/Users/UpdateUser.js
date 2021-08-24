import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
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
import { useParams } from "react-router-dom";
import { InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import _ from "lodash";

const useStyles = makeStyles(styles);
const useStylesSelect = makeStyles(stylesSelect);
export default function UpdateUser() {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    reset,
    setError,
    getValues,
  } = useForm({});
  const [role, setRole] = useState("user");
  const classesSelect = useStylesSelect();
  const [showPassword, setShowPassword] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [emails, setEmails] = useState([]);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  //const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    let customData = _.cloneDeep(data);

    customData.role = role;

    if (_.isEmpty(customData.password)) {
      delete customData.password;
    }
    if (emailValid) {
      await UserService.updateUser(id, customData);
      history.push("/admin/users");
    } else {
      setError("email", {
        type: "manual",
        message: "Este email ya esta registrado",
      });
    }
  };

  useEffect(() => {
    UserService.getUserById(id).then((response) => {
      setValue("displayName", response.displayName);
      setValue("email", response.email);
      setRole(response.customClaims.role);
      setCurrentEmail(response.email);
    });
    fetchUsers(true);
  }, []);
  const fetchUsers = (update = false) => {
    UserService.getUsers(update).then(function (list) {
      if (list) {
        const mappedData = list
          .filter((user) => user.email !== currentEmail)
          .map((user) => {
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
    if (currentEmail !== newEmail) {
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
              <h4 className={classes.cardIconTitle}>Actualizar usuario </h4>
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
                      inputRef={register(inputValidation.fullname)}
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
                        type: "text",
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
                      Nueva Contraseña *
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
                              //onMouseDown={handleMouseDownPassword}
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
                      inputRef={register(inputValidation.passwordCustom)}
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
                        defaultValue={role}
                        value={role}
                        select
                        onChange={(e) => setRole(e.target.value, true)}
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
