import { useState } from "react";

function useModal({ onClose = () => null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const openModal = (data) => {
    setData(data);
    setIsOpen(true);
  };
  const closeModal = () => {
    setData(null);
    setIsOpen(false);
    onClose();
  };
  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setData(null);
      onClose();
    }
  };

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
  };
}

export default useModal;
