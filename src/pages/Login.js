import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = () => {
    if (username === 'user' && password === 'password') {
      localStorage.setItem('authenticated', 'true');
      navigate('./SaleOrders'); 
    }
  };
  
  return (
    <Box width="300px" margin="100px auto">
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <Button mt={4} colorScheme="teal" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
