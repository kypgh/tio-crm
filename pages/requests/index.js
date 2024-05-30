import { PageOuter, Title } from "../../components/generic";

import RequestsTable from "../../components/tableComponents/RequestsTable";

const Requests = () => {
  return (
    <PageOuter>
      <Title>REQUESTS</Title>
      <RequestsTable />
    </PageOuter>
  );
};
export default Requests;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
