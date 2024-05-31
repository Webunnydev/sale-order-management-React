 
  export const products = [
    {
      id:10,
      name: "Tea",
      skus: [
        { id: 248, selling_price: 54, max_retail_price: 44 },
        { id: 247, selling_price: 32, max_retail_price: 32 },
        { id: 246, selling_price: 23, max_retail_price: 21 }
      ]
    },
    {
        id: 11,
        name: "Bamboo",
        skus: [
            { id: 111, selling_price: 70, max_retail_price: 80 },
            { id: 112, selling_price: 40, max_retail_price: 50 },
            { id: 113, selling_price: 25, max_retail_price: 30 }
        ]
      },
      {
        id: 12,
        name: "Cycle",
        skus: [
            { id: 121, selling_price: 90, max_retail_price: 110 },
            { id: 122, selling_price: 70, max_retail_price: 100 },
            { id: 123, selling_price: 45, max_retail_price: 90}
        ]
      },
      {
        id: 13,
        name: "stock",
        skus: [
            { id: 131, selling_price: 70, max_retail_price: 80 },
            { id: 132, selling_price: 40, max_retail_price: 50 },
            { id: 133, selling_price: 25, max_retail_price: 30 }
        ]
      },
      {
        id: 14,
        name: "Anonymous Product",
        skus: [
            { id: 141, selling_price: 70, max_retail_price: 80 },
            { id: 142, selling_price: 40, max_retail_price: 50 },
            { id: 143, selling_price: 25, max_retail_price: 30 }
        ]
      },
 
  ];
  
   
  export const submitSaleOrder = async (formData) => {
    console.log("Submitted Sale Order:", formData);
  };

  const notPaidOrders = [];

  export const saveOrderToData = (order) => {
    notPaidOrders.push(order);
    console.log('Order saved:', order);
    console.log('Not paid orders:', notPaidOrders);
  };
