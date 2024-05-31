import React, { useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, useDisclosure } from '@chakra-ui/react';
import ActiveOrders from '../components/ActiveOrders';
import CompletedOrders from '../components/CompletedOrders';
import ThemeToggle from '../components/ThemeToggle';
import SaleOrderForm from '../components/SaleOrderForm';
import EditOrderModal from '../components/EditOrderModal'; 
import { products } from '../utils/data'; 


const SaleOrders = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);  

  const handleSaleOrderSubmit = (payload, isPaid) => {
    if (isPaid) {
      setCompletedOrders(prevOrders => [...prevOrders, payload]);
    } else {
      setActiveOrders(prevOrders => [...prevOrders, payload]);
    }
    onClose();
  };

  const handleOpenModal = () => {
    setSelectedOrder(null);  
    onOpen();  
  };

   
  const updateActiveOrders = (updatedOrder) => {
    console.log("Updated Order:", updatedOrder); 
    const updatedOrders = activeOrders.map(order =>
      order.id === updatedOrder.id ? updatedOrder : order
    );
    setActiveOrders(updatedOrders);
  };

 
  const updateCompletedOrders = (updatedOrder) => {
    const updatedOrders = completedOrders.map(order =>
      order.id === updatedOrder.id ? updatedOrder : order
    );
    setCompletedOrders(updatedOrders);
  };

 
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  return (
    <Box>
      <ThemeToggle />
      <Tabs>
        <TabList>
          <Tab>Active Orders</Tab>
          <Tab>Completed Orders</Tab>
          <Tab onClick={handleOpenModal}bg="green.200">+ Sale Order</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ActiveOrders orders={activeOrders} updateActiveOrders={updateActiveOrders} onEdit={handleEditOrder} /> { }
          </TabPanel>
          <TabPanel>
            <CompletedOrders orders={completedOrders} updateCompletedOrders={updateCompletedOrders} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <SaleOrderForm isOpen={isOpen} onClose={onClose} onSubmit={handleSaleOrderSubmit} products={products} />
      {selectedOrder && (
         <EditOrderModal
  isOpen={isOpen}
  onClose={onClose}
  orderData={selectedOrder}
  customerName={selectedOrder.customer_name}
  customerId={selectedOrder.customer_id}
  updateActiveOrders={updateActiveOrders}
  updateCompletedOrders={updateCompletedOrders}
  activeOrders={activeOrders}  
/>
      )}
    </Box>
  );
};

export default SaleOrders;
