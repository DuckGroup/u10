"use client";

import { useEffect, useState } from "react";
import { getOrderStats, type OrderStats } from "@/lib/api";

export default function TrackerCard() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getOrderStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load order statistics");
        console.error("Error fetching order stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
          Dashboard
        </h1>
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
          Dashboard
        </h1>
        <div className="flex justify-center items-center py-12"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Total Orders
            </h2>
          </div>

          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-bold text-black">
              {" "}
              {(stats.totalOrders)}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Active Orders
            </h2>
          </div>

          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-bold text-black">
              {(stats.activeOrders)}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Shipped Orders
            </h2>
          </div>

          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-bold text-black">
              {(stats.shippingOrders)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
