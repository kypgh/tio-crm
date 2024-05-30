import React from "react";
import { IoIosRefresh } from "react-icons/io";
import { ButtonBlue } from "../generic";

const RefreshButton = ({ onClick, isLoading }) => {
  return (
    <ButtonBlue onClick={onClick}>
      <IoIosRefresh className={isLoading ? "rotating-anim" : ""} />
    </ButtonBlue>
  );
};

export default RefreshButton;
