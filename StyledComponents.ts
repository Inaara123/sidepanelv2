import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`

export const Button = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  
  &:hover {
    background-color: #3574de;
  }
`

export const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
`

export const Text = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  margin: 8px 0;
`

export const ErrorText = styled(Text)`
  color: #d93025;
`

export const ConfirmButton = styled(Button)`
  background-color: #34a853;
  
  &:hover {
    background-color: #2d9144;
  }
`