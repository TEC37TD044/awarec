const required = {
  value: true,
  message: "Campo requerido",
};

const email = {
  required,
  validate: (value) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) || "No es un correo valido",
};

const userName = {
  required,
  pattern: {
    value: /^[A-Za-z0-9]{1,15}$/,
    message: "Solo debe contener letras y números",
  },
};

const name = {
  required,
  pattern: {
    value: /^[A-Za-z ]{1,15}$/,
    message: "Solo debe contener letras",
  },
};

const fullname = {
  required,
  pattern: {
    value: /^[a-z ,.'-]+$/i,
    message: "Solo debe contener letras",
  },
};
/**
 * validaciones contraseña:
 * - mínimo 8 caracteres
 * - debe contener al menos una mayuscula, una miniscula, un número
 */
const password = {
  required,
  validate: {
    length: (value) => value.length >= 8 || "Debe tener al menos 8 carácteres",
    number: (value) =>
      /(?=.*?[0-9])/.test(value) || "Debe tener al menos un número",
    lowerCase: (value) =>
      /(?=.*?[a-z])/.test(value) || "Debe tener al menos una letra minúscula",
    upperCase: (value) =>
      /(?=.*?[A-Z])/.test(value) || "Debe tener al menos una letra mayúscula",
  },
};

/**
 * compara que dos valores sean iguales
 * @param {Function} getValues referencia a la funcion getValues
 * @param {string} name nombre del input con el cual se comparará
 */
const confirmPassword = (getValues, name) => ({
  required,
  validate: (value) =>
    value === getValues(name) || "Las contraseñas no coinciden",
});

const texto = {
  required,
  validate: {
    length: (value) => value.length >= 2 || "Campo requerido",
  },
};

// Para el hook custom useForm
const textoCustom = {
  required,
  isValid: (value) => value.length >= 2,
  message: "Campo requerido",
};

const passwordCustom = {
  validate: {
    length: (value) =>
      value.length == 0 ||
      value.length >= 8 ||
      "Debe tener al menos 8 carácteres",
    //length: (value) => value.length >= 8 || "Debe tener al menos 8 carácteres",
    number: (value) =>
      /(?=.*?[0-9]{0,8})/.test(value) || "Debe tener al menos un número",
    lowerCase: (value) =>
      /(?=.*?[a-z]{0,8})/.test(value) ||
      "Debe tener al menos una letra minúscula",
    upperCase: (value) =>
      /(?=.*?[A-Z]{0,8})/.test(value) ||
      "Debe tener al menos una letra mayúscula",
  },
};

export default {
  userName,
  name,
  email,
  password,
  confirmPassword,
  texto,
  textoCustom,
  passwordCustom,
  fullname,
};
