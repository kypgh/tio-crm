import styled from "styled-components";

const DataBox = styled.div`
  width: 100%;
  min-height: 100px;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.primary};
`;

const Text = styled.div`
  text-align: left;
  width: 100%;
  padding-bottom: 20px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const Data = styled.div`
  font-size: 18px;
  font-weight: bold;
  width: 70%;
  color: ${({ theme }) => theme.textSecondary};
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  font-size: 20px;
  position: relative;

  color: ${({ theme }) => theme.textSecondary};
  & p {
    position: absolute;
    font-size: 9px;
    font-weight: 700;
    top: 3px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.primary};
  }
`;

/**
 *
 * @param {{
 *  style: React.CSSProperties?
 * }} param0
 * @returns
 */
function InfoBox({ title, data, icon, extra, style }) {
  data = data?.toString();
  return (
    <DataBox style={style}>
      <Text>{title}</Text>
      <Data>{data}</Data>
      <Icon>
        {icon}
        {extra && <p>{extra}</p>}
      </Icon>
    </DataBox>
  );
}

export default InfoBox;
