import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  background: #312e38;
  height: 50px;
  padding: 10px 10px;
  color: #312e38;
  width: 100%;
  font-weight: 500;
  margin-right: 20px;
  transition: background-color 0.2s;
  color: #000;
  gap: 16px;

  img {
    height: 50px;
    width: 50px;
  }

  h1 {
      margin-top: 18px;
      color: #fff;
      font-size: 16px;
  }

  div {
      margin-top: 2px;      
      width: auto;
      min-width: 60px;
      
  }

`;