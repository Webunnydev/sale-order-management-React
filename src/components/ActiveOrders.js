 
import EditOrderModal from './EditOrderModal';
import React from 'react';
import { Box, Button, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';

const ActiveOrders = ({ orders, updateActiveOrders, onEdit }) => { 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    onEdit(order);  
  };

  const handleUpdateOrder = (updatedOrder) => {
    updateActiveOrders(updatedOrder); 
  };

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Customer</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.customer_id}</Td>
              <Td>{order.customer_name}</Td>
              <Td> ₹ {order.amount} </Td>
              <Td>{order.date}</Td>
              <Td>
              <Button onClick={() => handleEdit(order)} bg="green.200">Edit</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {selectedOrder && <EditOrderModal isOpen={isOpen} onClose={onClose} orderData={selectedOrder} customerName={selectedOrder.customer_name} customerId={selectedOrder.customer_id} updateActiveOrders={handleUpdateOrder} />}  
    </Box>
  );
};

export default ActiveOrders;
