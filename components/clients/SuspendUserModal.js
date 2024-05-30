import styled from "styled-components";
import { ActionButton, ButtonRed } from "../generic";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Container = styled.div`
  max-width: 700px;
  max-height: calc(100vh - 70px);
  overflow: auto;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  color: ${({ theme }) => theme.textPrimary};

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.primary};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand};
    border-radius: 50px;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  gap: 10px;
  & > * {
    width: 140px;
    justify-content: center;
  }
`;

const SuspendUserModal = ({ client, closeModal }) => {
  const notify = useNotification();
  const queryClient = useQueryClient();
  const [selectedBrand] = useSelectedBrand();
  const suspendMutation = useMutation({
    mutationFn: async () => {
      return !client.isSuspended
        ? agent().suspendUser(client._id)
        : agent().unsuspendUser(client._id);
    },
    onSuccess: () => {
      notify.SUCCESS(
        `User ${client.isSuspended ? "unsuspended" : "suspended"} Successfully`
      );
      queryClient.invalidateQueries([selectedBrand, "client", client._id]);
      closeModal();
    },
    onError: () => {
      notify.ERROR("Something went wrong, please try again later");
      closeModal();
    },
  });

  return (
    <Container>
      <h2>{client.isSuspended ? "Unsuspend" : "Suspend"} User</h2>
      <p>
        Are you sure you want to {client.isSuspended ? "unsuspend" : "suspend"}{" "}
        <strong style={{ textDecoration: "underline" }}>
          {client.first_name} {client.last_name}
        </strong>
        ?
      </p>
      <BtnContainer>
        <ActionButton onClick={() => closeModal()}>
          <FaTimes />
          <span>- Cancel</span>
        </ActionButton>
        <ButtonRed onClick={() => suspendMutation.mutate()}>
          <span>{client.isSuspended ? "Unsuspend" : "Suspend"} -</span>
          <FaCheck />
        </ButtonRed>
      </BtnContainer>
    </Container>
  );
};

export default SuspendUserModal;
