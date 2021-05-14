import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  margin: 16px;
  gap: 16px;
 
  div {
      margin-top: 5px;      
      width: auto;
      min-width: 60px;
 
  }

`;

export const Button = styled.button`
 
 height: 30px;
 background-color: #312e38;
 color: #fff;
 border: none;
 font-weight: 500;


`;