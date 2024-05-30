import { PageOuter, Title } from "../../components/generic";

import RequestsTable from "../../components/tableComponents/RequestsTable";
import { USER_REQUEST_TYPES } from "../../config/enums";

const DeleteAccount = () => {
  return (
    <PageOuter>
      <Title>DELETE ACCOUNT REQUESTS</Title>
      <RequestsTable
        defaultFilter={`request_type:${USER_REQUEST_TYPES.deleteAccount}`}
      />
    </PageOuter>
  );
};
export default DeleteAccount;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
