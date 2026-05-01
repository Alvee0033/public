"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/orders");

        console.log("Orders data:", response.data);

        // Assuming the response has a data property with the orders array
        if (response.data && Array.isArray(response.data.data)) {
          setOrders(response.data.data);
        } else {
          setOrders(response.data || []);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor"></div>
          <p className="mt-2">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md border border-red-100 text-red-700">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">You don't have any orders yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h3 className="font-medium">
                    Order #{order.order_number || order.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.order_date
                      ? format(new Date(order.order_date), "MMM dd, yyyy")
                      : "No date"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${order.sub_total_excluded_tax || 0}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.payment_completed
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.payment_completed ? "Paid" : "Payment Pending"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Order Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Items: {order.number_of_items}
                    </p>
                    <p className="text-sm text-gray-500">
                      Type: {order.service_or_product ? "Product" : "Service"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Ship to: {order.full_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {[order.street_address, order.city, order.zip_code]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {order.customer_notes && (
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Note:</strong> {order.customer_notes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;