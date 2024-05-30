import ClientsTable from "../../components/tableComponents/ClientsTable";
import { PageOuter } from "../../components/generic";
import { Title } from "../../components/generic";
import Head from "next/head";

const Clients = () => {
  return (
    <PageOuter>
      <Head>
        <title>Flo CRM | Clients </title>
      </Head>
      <Title>CLIENTS</Title>
      <ClientsTable />
    </PageOuter>
  );
};
export default Clients;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
