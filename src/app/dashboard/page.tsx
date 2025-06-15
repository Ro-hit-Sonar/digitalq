"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import Card from "@/components/ui/Card";

interface Customer {
  id: string;
  name: string;
  status: "waiting" | "served";
  joinedAt: string;
}

export default function DashboardPage() {
  const [queueName, setQueueName] = useState("");
  const [queueId, setQueueId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Load saved queue ID on mount
  useEffect(() => {
    const savedQueueId = localStorage.getItem("queueId");
    if (savedQueueId) {
      setQueueId(savedQueueId);
      setShowQR(true);
    }
  }, []);

  const fetchQueueData = useCallback(async () => {
    if (!queueId) return;

    try {
      const response = await fetch(`/api/queue/${queueId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setQueueId(null);
          setQueueName("");
          setCustomers([]);
          setShowQR(false);
          localStorage.removeItem("queueId");
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
    }
  }, [queueId]);

  useEffect(() => {
    if (queueId) {
      fetchQueueData();
      const interval = setInterval(fetchQueueData, 5000);
      return () => clearInterval(interval);
    }
  }, [queueId, fetchQueueData]);

  const handleCreateQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: queueName }),
      });

      if (!response.ok) throw new Error("Failed to create queue");

      const data = await response.json();
      setQueueId(data.id);
      localStorage.setItem("queueId", data.id);
      setShowQR(true);
      toast.success("Queue created successfully!");
    } catch (error) {
      console.error("Error creating queue:", error);
      toast.error("Failed to create queue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCustomer = async (customerId: string) => {
    try {
      const response = await fetch(
        `/api/queue/${queueId}/customer/${customerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to remove customer");

      toast.success("Customer removed successfully");
      fetchQueueData();
    } catch (error) {
      console.error("Error removing customer:", error);
      toast.error("Failed to remove customer");
    }
  };

  const handleMarkServed = async (customerId: string) => {
    try {
      const response = await fetch(
        `/api/queue/${queueId}/customer/${customerId}/serve`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) throw new Error("Failed to mark customer as served");

      toast.success("Customer marked as served");
      fetchQueueData();
    } catch (error) {
      console.error("Error marking customer as served:", error);
      toast.error("Failed to mark customer as served");
    }
  };

  const handleEndQueue = () => {
    setQueueId(null);
    setQueueName("");
    setCustomers([]);
    setShowQR(false);
    localStorage.removeItem("queueId");
    toast.success("Queue ended successfully");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Queue Management</h1>

        {!queueId ? (
          <form onSubmit={handleCreateQueue} className="space-y-4">
            <InputField
              label="Queue Name"
              value={queueName}
              onChange={(e) => setQueueName(e.target.value)}
              required
              placeholder="Enter queue name"
            />
            <Button type="submit" isLoading={isLoading}>
              Create Queue
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{queueName}</h2>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setShowQR(!showQR)}>
                  {showQR ? "Hide QR Code" : "Show QR Code"}
                </Button>
                <Button variant="danger" onClick={handleEndQueue}>
                  End Queue
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showQR && queueId && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                >
                  <QRCodeSVG
                    value={`${window.location.origin}/queue/${queueId}`}
                    size={200}
                    level="H"
                    includeMargin
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Scan to join queue
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Queue</h3>
              <AnimatePresence>
                {customers.map((customer) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
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
                    <div className="flex gap-2">
                      {customer.status === "waiting" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMarkServed(customer.id)}
                        >
                          Mark Served
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveCustomer(customer.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
