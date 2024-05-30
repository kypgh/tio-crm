import React from "react";
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
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
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

export default function ConfirmModal({ message, onConfirm, onReject }) {
  return (
    <Modal>
      <Container>
        <p>{message}</p>
        <BtnsContainer>
          <Btns className="yes" onClick={onConfirm}>
            Yes
          </Btns>
          <Btns onClick={onReject}>No</Btns>
        </BtnsContainer>
      </Container>
    </Modal>
  );
}
