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
}
