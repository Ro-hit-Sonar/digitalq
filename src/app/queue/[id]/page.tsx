"use client";

import { useState, useEffect, useCallback } from "react";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import Card from "@/components/ui/Card";

interface Customer {
  id: string;
  name: string;
  status: "waiting" | "served";
  joinedAt: string;
}

export default function QueueJoinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [queueName, setQueueName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);

  const fetchQueueData = useCallback(async () => {
    try {
      const response = await fetch(`/api/queue/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Queue not found");
          return;
        }
        throw new Error("Failed to fetch queue data");
      }
      const data = await response.json();
      setQueueName(data.name);
      setCustomers(data.customers);
    } catch (error) {
      console.error("Error fetching queue data:", error);
      toast.error("Failed to fetch queue data");
    } finally {
      setIsLoadingQueue(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 5000);
    return () => clearInterval(interval);
  }, [id, fetchQueueData]);

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/queue/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: customerName }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Queue not found");
          return;
        }
        throw new Error("Failed to join queue");
      }

      setHasJoined(true);
      toast.success("Successfully joined the queue!");
      fetchQueueData();
    } catch (error) {
      console.error("Error joining queue:", error);
      toast.error("Failed to join queue");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingQueue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading queue...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <h1 className="text-2xl font-bold mb-6">
          {queueName || "Queue Not Found"}
        </h1>

        <AnimatePresence mode="wait">
          {!hasJoined ? (
            <motion.form
              key="join-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleJoinQueue}
              className="space-y-4"
            >
              <InputField
                label="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                placeholder="Enter your name"
              />
              <Button type="submit" isLoading={isLoading}>
                Join Queue
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="queue-status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-800 dark:text-green-200">
                  You have successfully joined the queue! Please wait for your
                  turn.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Queue</h3>
                <div className="space-y-2">
                  {customers.map((customer) => (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        customer.name === customerName
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Status:{" "}
                          <span
                            className={
                              customer.status === "served"
                                ? "text-green-600 dark:text-green-400"
                                : "text-yellow-600 dark:text-yellow-400"
                            }
                          >
                            {customer.status.charAt(0).toUpperCase() +
                              customer.status.slice(1)}
                          </span>
                        </p>
                      </div>
                      {customer.name === customerName && (
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          You
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
