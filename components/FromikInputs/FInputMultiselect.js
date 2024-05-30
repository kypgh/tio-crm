import { useField } from "formik";
import React from "react";
import InputMultiSelect from "../formComponents/InputMultiselect";

const FInputMultiselect = (props) => {
  const [field, meta, helpers] = useField(props.name);
  return (
    <InputMultiSelect
      label={props.label}
      onChange={(v) => {
        helpers.setValue(v);
        helpers.setTouched(true);
      }}
      value={field.value}
    />
  );
};

export default FInputMultiselect;
