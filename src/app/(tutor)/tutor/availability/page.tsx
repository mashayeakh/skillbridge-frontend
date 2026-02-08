/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, CheckCircle, XCircle, Loader2, Trash2 } from "lucide-react";
import { createTutorAvailabilitySlot, deleteTutorAvailabilitySlot, getTutorProfileWithAvailabilities } from "@/actions/tutor";


export default function TutorAvailabilityPage() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch availabilities on mount using Server Action
  useEffect(() => {
    loadAvailabilities();
  }, []);

  const loadAvailabilities = async () => {
    try {
      const result = await getTutorProfileWithAvailabilities();

      if (!result.success) {
        throw new Error(result.message || "Failed to load availabilities");
      }

      setSlots(result.data.availabilities || []);
    } catch (err: any) {
      console.error("Load availabilities error:", err);
      setMessage({
        text: err.message || "Failed to load availabilities",
        type: "error"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!startTime || !endTime) {
      setMessage({
        text: "Please select both start and end times",
        type: "error"
      });
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setMessage({
        text: "End time must be after start time",
        type: "error"
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const result = await createTutorAvailabilitySlot(startTime, endTime);

      console.log("RESSULKLKLTT", result)

      if (!result.success) {
        throw new Error(result.message || "Failed to create availability slot");
      }

      setSlots((prev) => [...prev, result.data]);
      setMessage({
        text: "Availability slot created successfully! 🎉",
        type: "success"
      });
      setStartTime("");
      setEndTime("");

      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err: any) {
      setMessage({
        text: err.message || "Failed to create availability slot",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this availability slot?")) return;

    setDeletingId(id);
    try {
      const result = await deleteTutorAvailabilitySlot(id);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete slot");
      }

      setSlots((prev) => prev.filter((slot) => slot.id !== id));
      setMessage({
        text: "Slot deleted successfully",
        type: "success"
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err: any) {
      setMessage({
        text: err.message || "Failed to delete slot",
        type: "error"
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ----------------- Helpers for display - NO TIMEZONE CONVERSION ----------------- //

  // Format date without timezone conversion (shows exactly what's stored)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Use UTC methods to avoid timezone shifts
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();

    return new Date(Date.UTC(year, month, day)).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  // Format time without timezone conversion (shows exactly what's stored)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    // Use UTC methods to avoid timezone shifts
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    return new Date(Date.UTC(1970, 0, 1, hours, minutes)).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC"
    });
  };

  const getDuration = (start: string, end: string) => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getTimeUntil = (dateString: string) => {
    const slotDate = new Date(dateString);
    const nowDate = new Date();

    // Calculate difference in days
    const diffMs = slotDate.getTime() - nowDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Past";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    return `In ${Math.floor(diffDays / 7)} weeks`;
  };

  const upcomingSlots = slots.filter((s) => new Date(s.startTime) > new Date());
  const pastSlots = slots.filter((s) => new Date(s.startTime) <= new Date());

  // ----------------- JSX ----------------- //
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Your Availability</h1>
          <p className="text-gray-600">Set your tutoring hours and let students book sessions with you</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
              }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Create Availability Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-600" />
            Add New Availability Slot
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Select your local time
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Time will display as selected
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Availability Slot
                </>
              )}
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{slots.length}</div>
            <div className="text-sm text-gray-600">Total Slots</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{upcomingSlots.length}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-gray-600">{pastSlots.length}</div>
            <div className="text-sm text-gray-600">Past</div>
          </div>
        </div>

        {/* Upcoming Slots */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Availability</h2>
          {upcomingSlots.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500 border border-gray-200">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No upcoming availability slots. Create one above!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-blue-600 mb-1">
                        {getTimeUntil(slot.startTime)}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatDate(slot.startTime)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      disabled={deletingId === slot.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === slot.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Duration: {getDuration(slot.startTime, slot.endTime)}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${slot.isBooked
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                        }`}>
                        {slot.isBooked ? "Booked" : "Available"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Slots */}
        {pastSlots.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Past Availability</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {pastSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-gray-50 rounded-lg p-5 border border-gray-200 opacity-75"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-500 mb-1">
                        Past
                      </div>
                      <div className="text-lg font-semibold text-gray-700">
                        {formatDate(slot.startTime)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Duration: {getDuration(slot.startTime, slot.endTime)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}