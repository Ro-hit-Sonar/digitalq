// Mock queue data
const queues: {
  [key: string]: { id: string; name: string; customers: Customer[] };
} = {};

export interface Customer {
  id: string;
  name: string;
  position: number;
  status: "waiting" | "served";
  joinedAt: number;
}

// Initialize some dummy data
const initializeDummyData = () => {
  const queueId = "abc123"; // Example queue ID
  queues[queueId] = {
    id: queueId,
    name: "Main Queue",
    customers: [
      {
        id: "1",
        name: "John Doe",
        position: 1,
        status: "waiting",
        joinedAt: Date.now() - 10000,
      },
      {
        id: "2",
        name: "Jane Smith",
        position: 2,
        status: "waiting",
        joinedAt: Date.now() - 5000,
      },
    ],
  };
};

initializeDummyData();

export const queueService = {
  // Get queue by ID
  getQueue: (queueId: string) => {
    return queues[queueId];
  },

  // Add customer to queue
  joinQueue: (queueId: string, name: string): Customer => {
    if (!queues[queueId]) {
      queues[queueId] = {
        id: queueId,
        name: "New Queue",
        customers: [],
      };
    }

    const customer: Customer = {
      id: Math.random().toString(36).substring(2, 8),
      name,
      position: queues[queueId].customers.length + 1,
      status: "waiting",
      joinedAt: Date.now(),
    };

    queues[queueId].customers.push(customer);
    return customer;
  },

  // Get customer position
  getCustomerPosition: (queueId: string, customerId: string): number => {
    const queue = queues[queueId];
    if (!queue) return -1;

    const customer = queue.customers.find((c) => c.id === customerId);
    if (!customer) return -1;

    return (
      queue.customers
        .filter((c) => c.status === "waiting")
        .findIndex((c) => c.id === customerId) + 1
    );
  },

  // Simulate queue updates (for demo purposes)
  simulateQueueUpdate: (queueId: string) => {
    const queue = queues[queueId];
    if (!queue) return;

    // Randomly mark some customers as served
    queue.customers = queue.customers.map((customer) => {
      if (customer.status === "waiting" && Math.random() < 0.2) {
        return { ...customer, status: "served" };
      }
      return customer;
    });

    // Recalculate positions
    let position = 1;
    queue.customers = queue.customers.map((customer) => {
      if (customer.status === "waiting") {
        return { ...customer, position: position++ };
      }
      return customer;
    });
  },
};
