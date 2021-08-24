import { useState } from "react";
import _ from "lodash";

export const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [validationRules, setValidationRules] = useState({});
  const [firstRender, setFirstRender] = useState(true);

  const handleInputChange = ({ target }) => {
    setValues({
      ...values,
      [target.name]: target.value,
    });

    if (!_.isUndefined(validationRules[target.name])) {
      singleValidation(target.name, target.value);
    }
  };

  const register = (name, rules) => {
    if (_.isUndefined(validationRules[name])) {
      setValidationRules({
        ...validationRules,
        [name]: rules,
      });
    }
  };

  const reset = () => {
    setValues({});
  };

  const handleChangeChecked = ({ target }) => {
    setValues({
      ...values,
      [target.name]: target.checked,
    });
  };

  const singleValidation = (name, value) => {
    const newErrors = errors;
    const validation = validationRules[name];
    if (validation?.isValid && !validation.isValid(value)) {
      newErrors[name] = validation.message;
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };
  const singleValidationByRule = async () => {
    const newErrors = {};
    for (const key in validationRules) {
      let value = values[key];
      let validation = validationRules[key];

      if (validation?.isValid && !validation.isValid(value)) {
        newErrors[key] = {};
        newErrors[key] = validation.message;
      } else {
        delete newErrors?.[key];
      }
    }
    setErrors(newErrors);
    setFirstRender(false);
    return _.size(newErrors);
  };

  const handleSubmit = async (event, onSubmit) => {
    event.preventDefault();

    // if (!(_.size(errors) > 0)) {
    //   let valid = true;
    //   const newErrors = {};

    //   for (const key in validationRules) {
    //     const value = values[key];
    //     const validation = validationRules[key];
    //     if (validation?.isValid && !validation.isValid(value)) {
    //       valid = false;
    //       newErrors[key] = validation.message;
    //     }
    //   }

    //   if (!valid) {
    //     setErrors(newErrors);
    //   } else {
    //     setErrors({});
    //   }
    // }

    if (firstRender) {
      if (singleValidationByRule() === 0) {
        onSubmit(values);
      }
    } else {
      if (_.size(errors) === 0) {
        setFirstRender(false);
        onSubmit(values);
      }
    }
  };

  return {
    values,
    register,
    handleInputChange,
    validationRules,
    reset,
    handleSubmit,
    errors,
    handleChangeChecked,
  };
};
