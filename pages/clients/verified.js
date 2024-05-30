import ClientsTable from "../../components/tableComponents/ClientsTable";
import { PageOuter } from "../../components/generic";
import { Title } from "../../components/generic";
import Head from "next/head";

const VerifiedClients = () => {
  return (
    <PageOuter>
      <Head>
        <title>Flo CRM | Verified Clients </title>
      </Head>
      <Title>VERIFIED CLIENTS</Title>
      <ClientsTable defaultFilter={"emailVerified:true"} />
    </PageOuter>
  );
};
export default VerifiedClients;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
