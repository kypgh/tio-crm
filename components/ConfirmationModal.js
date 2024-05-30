import React, { useState } from "react";
import styled from "styled-components";

import { colors } from "../config/colors";

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBG = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -1;
`;

const Message = styled.p`
  font-size: 18px;
  font-weight: 700;
`;

const Container = styled.div`
  max-width: 500px;
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.white};
  padding: 20px 10px;
`;

const BtnsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  max-width: 100%;
  width: 100%;
`;

const Btns = styled.div`
  max-width: 100px;
  width: 100%;
  padding: 10px;
  text-align: center;
  color: ${({ theme }) => theme.white};
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};

  &.yes {
    background-color: ${({ theme }) => theme.errorMsg};
  }
`;

const ConfirmationModal = ({ children, message = "Are you sure?" }) => {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);

  const show = (callback) => (event) => {
    event.preventDefault();
    setOpen(true);
    event = {
      ...event,
      target: { ...event.target, value: event.target.value },
    };
    setCallback({
      run: () => callback(event),
    });
  };

  const hide = () => {
    setCallback(null);
    setOpen(false);
  };

  const confirm = () => {
    callback.run();
    hide();
  };

  return (
    <>
      {children(show)}
      {open && (
        <Modal>
          <ModalBG onClick={hide} />
          <Container>
            <Message>{message}</Message>
            <BtnsContainer>
              <Btns onClick={confirm} className="yes">
                Yes
              </Btns>
              <Btns onClick={hide}>No</Btns>
            </BtnsContainer>
          </Container>
        </Modal>
      )}
    </>
  );
};
export default ConfirmationModal;
