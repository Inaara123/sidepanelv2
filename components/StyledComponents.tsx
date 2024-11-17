// src/components/layout/StyledComponents.tsx

import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
`

export const Tab = styled.div<{ active: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#4285f4' : 'transparent'};
  color: ${props => props.active ? '#4285f4' : '#666'};
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`

export const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`

export const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`

export const Button = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
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

export const LinkText = styled.span`
  color: #4285f4;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 8px;
  display: inline-block;
`

export const ConfirmButton = styled(Button)`
  background-color: #34a853;
  
  &:hover {
    background-color: #2d9144;
  }
`

export const SelectButton = styled(Button)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  margin-bottom: 8px;
`

export const XPathText = styled.span`
  font-size: 12px;
  color: #666;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`