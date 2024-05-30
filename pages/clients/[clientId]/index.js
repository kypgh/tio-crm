import ClientDetails from "./[tab]";

export default ClientDetails;

export async function getServerSideProps(context) {
  const { clientId } = context.query;
  return {
    props: {
      id: clientId,
      tab: "notes",
    },
  };
}
