import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, Input, FormControl, FormLabel, Box, Select, Text, VStack, HStack } from '@chakra-ui/react';
import { submitSaleOrder, saveOrderToData } from '../utils/data';  

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const SaleOrderForm = ({ isOpen, onClose, onSubmit, products }) => {
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderState, setOrderState] = useState('notPaid');

  useEffect(() => {
    calculateTotalPrice();
  }, [productQuantities]);

  const handleFormSubmit = (data) => {
    const items = selectedProducts.flatMap(productId => {
      const product = products.find(product => product.id === parseInt(productId));
      return product ? product.skus.map(sku => ({
        sku_id: sku.id,
        price: sku.selling_price,
        quantity: parseInt(productQuantities[sku.id] || 0)
      })) : [];
    });
  
    const payload = {
      customer_id: parseInt(data.customer_id),
      customer_name: data.customer_name,
      items,
      amount: totalPrice,
      paid: orderState === 'paid',
      invoice_no: data.invoice_no,
      date: invoiceDate.toISOString().split('T')[0],  
    };
  
    onSubmit(payload, orderState === 'paid');
  
    if (orderState !== 'paid') {
      saveOrderToData(payload);  
    }
  
     
    reset();
    setSelectedProducts([]);
    setProductQuantities({});
    setInvoiceDate(new Date());
    setTotalPrice(0);
    setOrderState('notPaid');
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


  const handleQuantityChange = (skuId, price, quantity) => {
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [skuId]: quantity
    }));
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Sale Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p={4} borderWidth={1} borderRadius="lg">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={errors.customer_id}>
                  <FormLabel htmlFor="customer_id">Customer ID</FormLabel>
                  <Input id="customer_id" type="number" {...register('customer_id', { required: 'Customer ID is required' })} />
                </FormControl>

                <FormControl isInvalid={errors.customer_name}>
                  <FormLabel htmlFor="customer_name">Customer Name</FormLabel>
                  <Input id="customer_name" type="text" {...register('customer_name', { required: 'Customer Name is required' })} />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="products">Products</FormLabel>
                  <Box position="relative">
                    <Button
                      onClick={() => setIsProductListOpen(!isProductListOpen)}
                      variant="outline"
                      width="100%"
                      mb={2}
                    >
                      {selectedProducts.length > 0 ? 
                        products
                          .filter(product => selectedProducts.includes(product.id.toString()))
                          .map(product => product.name)
                          .join(', ') 
                        : 'Select Products'}
                    </Button>
                    {isProductListOpen && (
                      <Select
                        id="products"
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

                {selectedProducts.length > 0 && (
                  <Box mt={4}>
                    {selectedProducts.map(productId => {
                      const product = products.find(product => product.id === parseInt(productId));
                      return product ? product.skus.map(sku => (
                        <Box key={sku.id} p={2} borderWidth={1} borderRadius="md" mb={2} position="relative">
                          <Text fontWeight="bold">
                            Product ID: {product.id}, SKU: {sku.id} (Rate ₹: {sku.selling_price})
                          </Text>
                          <FormControl isInvalid={errors[`quantity_${sku.id}`]}>
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
                )}

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
                  <Input id="invoice_no" type="text" {...register('invoice_no', { required: 'Invoice Number is required' })} />
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

                <Button colorScheme="teal" type="submit">
                  Submit Sale Order
                </Button>
              </VStack>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SaleOrderForm;
