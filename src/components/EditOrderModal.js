import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, Input, FormControl, FormLabel, Box, Select, Text, VStack, HStack } from '@chakra-ui/react';
import { saveOrderToData, products } from '../utils/data';  

const EditOrderModal = ({ isOpen, onClose, orderData, customerName, customerId, updateActiveOrders, updateCompletedOrders, activeOrders }) => {
  console.log('updateActiveOrders:', updateActiveOrders);
  const { register, handleSubmit, control, setValue } = useForm();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderState, setOrderState] = useState('notPaid');
  const [formData, setFormData] = useState({ customer_name: customerName, customer_id: customerId });

  useEffect(() => {
    if (isOpen && orderData) {
      setValue('invoice_no', orderData.invoice_no);
      setValue('invoice_date', new Date(orderData.date));
      setInvoiceDate(new Date(orderData.date));
      setOrderState(orderData.paid ? 'paid' : 'notPaid');
      const selectedSKUs = orderData.items.map(item => item.sku_id.toString());
      const selectedProductIds = products.filter(product => 
        product.skus.some(sku => selectedSKUs.includes(sku.id.toString()))
      ).map(product => product.id.toString());
      setSelectedProducts(selectedProductIds);
      setProductQuantities(Object.fromEntries(orderData.items.map(item => [item.sku_id, item.quantity])));
      calculateTotalPrice(selectedSKUs);
    }
  }, [isOpen, orderData, setValue]);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedProducts, productQuantities]);
  
  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  const handleFormSubmit = (data) => {
    const items = selectedProducts.flatMap(productId => {
      const product = products.find(product => product.id.toString() === productId);
      return product ? product.skus.map(sku => ({
        sku_id: sku.id,
        price: sku.selling_price,
        quantity: parseInt(productQuantities[sku.id] || 0)
      })) : [];
    });
    const updatedOrder = {
      ...orderData,  
      ...data,  
    };
  
    const payload = {
      ...orderData,
      ...data,
      items,
      amount: totalPrice,
      paid: orderState === 'paid',
      date: invoiceDate.toISOString().split('T')[0], 
    };
  
    saveOrderToData(payload);
  
    if (payload.paid) {
    
      updateCompletedOrders(payload);
    

      if (activeOrders) {
        const updatedActiveOrders = activeOrders.filter(order => order.id !== payload.id);
        updateActiveOrders(updatedActiveOrders);
      } else {
        console.error('Active orders not defined');
      }
    } else {
      updateActiveOrders(payload);
    }
    onClose(); 
  };
  
  
  
  const handleProductSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    const newSelectedProducts = [...selectedProducts];
    selectedOptions.forEach(option => {
      if (!newSelectedProducts.includes(option)) {
        newSelectedProducts.push(option); 
      } else {
        const index = newSelectedProducts.indexOf(option);
        newSelectedProducts.splice(index, 1);  
      }
    });
    setSelectedProducts(newSelectedProducts);
    setIsProductListOpen(false);  
  };

  const handleAddProductClick = () => {
    setIsProductListOpen(true);  
  };

  const handleQuantityChange = (skuId, price, quantity) => {
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [skuId]: quantity
    }));
    calculateTotalPrice(Object.keys(productQuantities));
  };

  const calculateTotalPrice = () => {
    let total = 0;
    selectedProducts.forEach(productId => {
      const product = products.find(product => product.id === parseInt(productId));
      if (product) {
        product.skus.forEach(sku => {
          if (productQuantities[sku.id]) {
            total += sku.selling_price * productQuantities[sku.id];
          }
        });
      }
    });
    setTotalPrice(total);
  };

  const handleOrderStateChange = (state) => {
    setOrderState(state);
  };

  const handleCustomerNameChange = (e) => {
    setFormData({ ...formData, customer_name: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Sale Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
 <Box p={4} borderWidth={1} borderRadius="lg" overflowY="auto">
    <form onSubmit={handleSubmit(handleFormSubmit)}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Customer ID</FormLabel>
                  <Input
                    value={formData.customer_id}
                    isReadOnly
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Customer</FormLabel>
                  <Input
                    {...register('customer_name')}
                    value={formData.customer_name}
                    onChange={handleCustomerNameChange}
                    _focus={{ borderBottomColor: 'black' }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Products</FormLabel>
                  <Box position="relative">
                    <Button
                      onClick={handleAddProductClick}
                      variant="outline"
                      width="100%"
                      mb={2}
                    >
                      {selectedProducts.length > 0 ?
                        selectedProducts.map(productId => 
                          products.find(product => product.id.toString() === productId)?.name
                        ).join(', ')
                        : 'Select Products'}
                    </Button>
                    {isProductListOpen && (
                      <Select
                        multiple
                        size="lg"
                        width="100%"
                        height="150px"
                        zIndex={9999}
                        value={selectedProducts}
                        onChange={handleProductSelection}
                      >
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Box>
                </FormControl>
                <Box mt={4}>
                  {selectedProducts.map(productId => {
                    const product = products.find(product => product.id === parseInt(productId));
                    return product ? product.skus.map(sku => (
                      <Box key={sku.id} p={2} borderWidth={1} borderRadius="md" mb={2} position="relative">
                      <Text fontWeight="bold">
                        Product ID: {product.id}, SKU: {sku.id} (Rate ₹: {sku.selling_price})
                      </Text>
                      <FormControl>
                        <FormLabel htmlFor={`quantity_${sku.id}`}>Enter Quantity</FormLabel>
                        <Controller
                          name={`quantity_${sku.id}`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              id={`quantity_${sku.id}`}
                              type="number"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleQuantityChange(sku.id, sku.selling_price, e.target.value);
                              }}
                            />
                          )}
                          rules={{ required: 'Quantity is required' }}
                        />
                      </FormControl>
                      <Box
                        position="absolute"
                        bottom={2}
                        right={2}
                        bg="green.200"
                        p={1}
                        borderRadius="md"
                      >
                        Items Remaining: {generateRandomNumber(20, 100)}
                      </Box>
                    </Box>
                  )) : null;
                })}
              </Box>
              <FormControl>
                <FormLabel>Total Price: ₹</FormLabel>
                <Text>{totalPrice}</Text>
              </FormControl>
              <HStack mt={4}>
                <Box
                  bg={orderState === 'paid' ? 'green.200' : 'gray.200'}
                  color={orderState === 'paid' ? 'green.900' : 'gray.900'}
                  p={2}
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => handleOrderStateChange('paid')}
                >
                  Paid
                </Box>
                <Box
                  bg={orderState === 'notPaid' ? 'red.200' : 'gray.200'}
                  color={orderState === 'notPaid' ? 'red.900' : 'gray.900'}
                  p={2}
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => handleOrderStateChange('notPaid')}
                >
                  Not Paid
                </Box>
              </HStack>
              <FormControl>
                <FormLabel>Invoice Number</FormLabel>
                <Input {...register('invoice_no')} />
              </FormControl>
              <FormControl>
                <FormLabel>Invoice Date</FormLabel>
                <Controller
                  control={control}
                  name="invoice_date"
                  render={({ field }) => (
                    <DatePicker
                      selected={invoiceDate}
                      onChange={(date) => {
                        setInvoiceDate(date);
                        field.onChange(date);
                      }}
                      dateFormat="yyyy-MM-dd"
                    />
                  )}
                />
              </FormControl>
              <Button colorScheme="teal" type="submit">Submit Changes</Button>
            </VStack>
          </form>
        </Box>
      </ModalBody>
    </ModalContent>
  </Modal>
);
};

export default EditOrderModal;
