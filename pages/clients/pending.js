import Head from "next/head";
import { PageOuter, Title } from "../../components/generic";
import ClientsTable from "../../components/tableComponents/ClientsTable";

const PendingClients = () => {
  return (
    <PageOuter>
      <Head>
        <title>Flo CRM | Pedning Clients </title>
      </Head>
      <Title>PENDING CLIENTS</Title>
      <ClientsTable defaultFilter={"emailVerified:false"} />
    </PageOuter>
  );
};
export default PendingClients;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
