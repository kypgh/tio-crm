import ClientsTable from "../../components/tableComponents/ClientsTable";
import { PageOuter } from "../../components/generic";
import { Title } from "../../components/generic";
import Head from "next/head";

const KycClients = () => {
  return (
    <PageOuter>
      <Head>
        <title>Flo CRM | Kyc Clients </title>
      </Head>
      <Title>KYC CLIENTS</Title>
      <ClientsTable defaultFilter={"kycStatus:approved"} />
    </PageOuter>
  );
};
export default KycClients;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
