import { v4 as uuidv4 } from "uuid";

export interface Customer {
  id: string;
  name: string;
  status: "waiting" | "served";
  joinedAt: string;
}

export interface Queue {
  id: string;
  name: string;
  customers: Customer[];
  createdAt: string;
}

class QueueStore {
  private queues: Map<string, Queue>;

  constructor() {
    this.queues = new Map();
  }

  createQueue(name: string): Queue {
    const id = uuidv4();
    const queue: Queue = {
      id,
      name,
      customers: [],
      createdAt: new Date().toISOString(),
    };
    this.queues.set(id, queue);
    return queue;
  }

  getQueue(id: string): Queue | undefined {
    return this.queues.get(id);
  }

  addCustomer(queueId: string, name: string): Customer {
    const queue = this.queues.get(queueId);
    if (!queue) {
      throw new Error("Queue not found");
    }

    const customer: Customer = {
      id: uuidv4(),
      name,
      status: "waiting",
      joinedAt: new Date().toISOString(),
    };

    queue.customers.push(customer);
    return customer;
  }

  removeCustomer(queueId: string, customerId: string): void {
    const queue = this.queues.get(queueId);
    if (!queue) {
      throw new Error("Queue not found");
    }

    queue.customers = queue.customers.filter(
      (customer) => customer.id !== customerId
    );
  }

  markCustomerAsServed(queueId: string, customerId: string): void {
    const queue = this.queues.get(queueId);
    if (!queue) {
      throw new Error("Queue not found");
    }

    const customer = queue.customers.find(
      (customer) => customer.id === customerId
    );
    if (!customer) {
      throw new Error("Customer not found");
    }

    customer.status = "served";
  }

  deleteQueue(id: string): void {
    this.queues.delete(id);
  }
}

export const queueStore = new QueueStore();
