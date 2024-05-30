import { PageOuter, Title } from "../../components/generic";

import RequestsTable from "../../components/tableComponents/RequestsTable";
import { USER_REQUEST_TYPES } from "../../config/enums";

const ChangeLeverage = () => {
  return (
    <PageOuter>
      <Title>CHANGE LEVERAGE REQUESTS</Title>
      <RequestsTable
        defaultFilter={`request_type:${USER_REQUEST_TYPES.changeAccountLeverage}`}
      />
    </PageOuter>
  );
};
export default ChangeLeverage;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
