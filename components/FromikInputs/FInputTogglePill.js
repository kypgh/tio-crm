import { useField } from "formik";
import React from "react";
import InputTogglePill from "../formComponents/InputTogglePill";

const FInputTogglePill = ({ name, label, ...props }) => {
  const [field, meta, helpers] = useField(name);
  return (
    <InputTogglePill
      onChange={field.onChange}
      checked={field.value}
      id={name}
      label={label}
    />
  );
};

export default FInputTogglePill;
