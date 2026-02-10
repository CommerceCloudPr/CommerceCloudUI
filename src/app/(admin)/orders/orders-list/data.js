// Mock data for order statistics cards
export const orderData = [
  {
    title: 'Order List',
    item: 850,
    icon: 'solar:clipboard-list-broken',
    color: 'primary'
  },
  {
    title: 'Payment Refund',
    item: 490,
    icon: 'solar:chat-round-money-broken',
    color: 'warning'
  },
  {
    title: 'Order Cancel',
    item: 241,
    icon: 'solar:cart-cross-broken',
    color: 'danger'
  },
  {
    title: 'Order Shipped',
    item: 630,
    icon: 'solar:box-broken',
    color: 'primary'
  },
  {
    title: 'Order Delivering',
    item: 170,
    icon: 'solar:tram-broken',
    color: 'info'
  },
  {
    title: 'Pending Review',
    item: 210,
    icon: 'solar:clipboard-remove-broken',
    color: 'secondary'
  },
  {
    title: 'Pending Payment',
    item: 608,
    icon: 'solar:clock-circle-broken',
    color: 'warning'
  },
  {
    title: 'Delivered',
    item: 200,
    icon: 'solar:clipboard-check-broken',
    color: 'success'
  },
  {
    title: 'In Progress',
    item: 656,
    icon: 'solar:inbox-line-broken',
    color: 'info'
  },
  {
    title: 'Store Sales',
    item: 320,
    icon: 'solar:shop-2-broken',
    color: 'success'
  },
  {
    title: 'Failed Payments',
    item: 3,
    icon: 'solar:danger-triangle-broken',
    color: 'danger'
  }
];

// Mock data for orders list
export const ordersListData = [
  {
    id: 25490,
    referenceId: '379NB17931',
    customerName: 'Ayşe Sürmen',
    phone: '905332455950',
    orderAmount: 10863.64,
    totalAmount: 11950.00,
    source: 'TicimaxWeb',
    status: 'Order Received',
    packagingStatus: 'Pending',
    paymentType: 'Credit Card',
    cargo: 'Aras Cargo',
    storeRejection: false,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 25488,
    referenceId: '584EK2874R',
    customerName: 'Yasemin Gürkan',
    phone: '905062977035',
    orderAmount: 2690.00,
    totalAmount: 2959.00,
    source: 'TicimaxWeb',
    status: 'Order Received',
    packagingStatus: 'Pending',
    paymentType: 'Credit Card',
    cargo: 'Aras Cargo',
    storeRejection: false,
    createdAt: new Date('2024-01-14'),
  },
  {
    id: 25485,
    referenceId: '231NR4436F',
    customerName: 'Şeyma Polat',
    phone: '905397222091',
    orderAmount: 6086.36,
    totalAmount: 6695.00,
    source: 'TicimaxWeb',
    status: 'Order Received',
    packagingStatus: 'Pending',
    paymentType: 'Credit Card',
    cargo: 'Aras Cargo',
    storeRejection: false,
    createdAt: new Date('2024-01-13'),
  },
  {
    id: 25485,
    referenceId: '877LJ4339B',
    customerName: 'gamze küçükaksoy',
    phone: '905378675074',
    orderAmount: 7622.73,
    totalAmount: 8385.00,
    source: 'TicimaxWeb',
    status: 'Order Received',
    packagingStatus: 'Pending',
    paymentType: 'Credit Card',
    cargo: 'Aras Cargo',
    storeRejection: false,
    createdAt: new Date('2024-01-12'),
  },
  {
    id: 25483,
    referenceId: '158NR3712J',
    customerName: 'Sonat Aksoy',
    phone: '905323937432',
    orderAmount: 3631.82,
    totalAmount: 3995.00,
    source: 'TicimaxWeb',
    status: 'Order Received',
    packagingStatus: 'Pending',
    paymentType: 'Credit Card',
    cargo: 'Aras Cargo',
    storeRejection: false,
    createdAt: new Date('2024-01-11'),
  },
  {
    id: 25480,
    referenceId: '492KL8821M',
    customerName: 'Mehmet Yılmaz',
    phone: '905551234567',
    orderAmount: 5420.50,
    totalAmount: 5962.00,
    source: 'TicimaxWeb',
    status: 'Preparing',
    packagingStatus: 'Packaging',
    paymentType: 'Credit Card',
    cargo: 'Yurtiçi Cargo',
    storeRejection: false,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 25478,
    referenceId: '673OP4521N',
    customerName: 'Zeynep Kaya',
    phone: '905449876543',
    orderAmount: 8750.25,
    totalAmount: 9625.00,
    source: 'Store',
    status: 'Shipped',
    packagingStatus: 'Completed',
    paymentType: 'Cash',
    cargo: 'MNG Cargo',
    storeRejection: false,
    createdAt: new Date('2024-01-09'),
  },
  {
    id: 25475,
    referenceId: '891QW2314P',
    customerName: 'Ali Demir',
    phone: '905338765432',
    orderAmount: 3200.00,
    totalAmount: 3520.00,
    source: 'TicimaxWeb',
    status: 'Cancelled',
    packagingStatus: 'Cancelled',
    paymentType: 'Credit Card',
    cargo: '-',
    storeRejection: true,
    createdAt: new Date('2024-01-08'),
  }
];

// Filter options
export const orderStatusOptions = [
  { value: 'all', label: 'All' },
  { value: 'order-received', label: 'Order Received' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

export const paymentTypeOptions = [
  { value: 'all', label: 'All' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'cash-on-delivery', label: 'Cash on Delivery' }
];

export const cargoOptions = [
  { value: 'all', label: 'All' },
  { value: 'aras-cargo', label: 'Aras Cargo' },
  { value: 'yurtici-cargo', label: 'Yurtiçi Cargo' },
  { value: 'mng-cargo', label: 'MNG Cargo' },
  { value: 'ptt-cargo', label: 'PTT Cargo' },
  { value: 'ups', label: 'UPS' }
];

export const orderSourceOptions = [
  { value: 'all', label: 'All' },
  { value: 'ticimax-web', label: 'TicimaxWeb' },
  { value: 'store', label: 'Store' },
  { value: 'phone', label: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp' }
];