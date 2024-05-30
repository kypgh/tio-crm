import React, { useEffect } from "react";
import styled from "styled-components";

import useModal from "../utils/hooks/useModal";

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999999;

  //overwrites the Cell component styles
  word-break: initial;
  font-size: 16px;
  cursor: default;
`;

const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -1;
`;

/**
 *
 * @param {{
 *  disableBackdropClick: boolean;
 *  children: ({ openModal: Function }) => JSX.Element;
 *  onCloseModal: Function;
 *  componentToShow: ({ closeModal: Function }) => JSX.Element;
 * }} param0
 * @returns {JSX.Element}
 */
function ModalHook({
  children,
  componentToShow,
  onCloseModal = () => null,
  disableBackdropClick = false,
}) {
  const { isOpen, openModal, closeModal, data } = useModal({
    onClose: onCloseModal,
  });

  if (isOpen)
    return (
      <>
        {children({ openModal })}
        <Modal
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ModalBg
            onClick={(e) => (!disableBackdropClick ? closeModal(e) : null)}
          />
          {React.cloneElement(componentToShow, {
            closeModal,
            modalData: data,
            isOpen,
          })}
        </Modal>
      </>
    );
  return children({ openModal });
}

const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;

  p {
    color: ${({ theme }) => theme.textPrimary};
    font-weight: 500;
    font-size: 20px;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Btn = styled.div`
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  color: ${({ theme }) => theme.white};
  min-width: 70px;
  text-align: center;
  font-weight: 600;
  background-color: ${({ theme }) => theme.primary};
  border: 2px solid ${({ theme }) => theme.errorMsg};

  &.yes {
    border: 2px solid ${({ theme }) => theme.success};
  }
`;

export const ConfirmationModal = ({
  message = "",
  onConfirm = () => null,
  onReject = () => null,
  modalData = {},
  closeModal,
}) => {
  return (
    <Modal>
      <ModalBg onClick={closeModal} />
      <Col>
        <p>{message}</p>
        <BtnContainer>
          <Btn className="yes" onClick={() => onConfirm(modalData)}>
            Yes
          </Btn>
          <Btn
            onClick={() => {
              onReject(modalData);
              closeModal();
            }}
          >
            No
          </Btn>
        </BtnContainer>
      </Col>
    </Modal>
  );
};

export default ModalHook;
