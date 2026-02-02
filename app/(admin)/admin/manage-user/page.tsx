/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { apiGet, apiPatch } from "@/lib/api";
import { Search, Filter, MoreVertical, Edit, Trash2, CheckCircle, XCircle, RefreshCw, Download, Ban, ShieldCheck } from "lucide-react";
import debounce from "lodash/debounce";
import { toast } from "sonner";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    lastLogin: string;
};

type FilterState = {
    search: string;
    role: string;
    status: string;
    dateRange: {
        from: string;
        to: string;
    };
    sortBy: "name" | "email" | "role" | "status" | "createdAt";
    sortOrder: "asc" | "desc";
};

export default function ManageUserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [bulkAction, setBulkAction] = useState<string>("");
    const [processingUserId, setProcessingUserId] = useState<string | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        banned: 0,
        admins: 0,
        users: 0,
    });

    const [filters, setFilters] = useState<FilterState>({
        search: "",
        role: "all",
        status: "all",
        dateRange: {
            from: "",
            to: "",
        },
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    // Calculate stats from users data
    const calculateStats = (usersData: User[]) => {
        const statsData = {
            total: usersData.length,
            active: usersData.filter((u: User) => u.status?.toUpperCase() === "ACTIVE").length,
            inactive: usersData.filter((u: User) => u.status?.toUpperCase() === "INACTIVE").length,
            banned: usersData.filter((u: User) => u.status?.toUpperCase() === "BANNED").length,
            admins: usersData.filter((u: User) => u.role?.toUpperCase() === "ADMIN").length,
            users: usersData.filter((u: User) => u.role?.toUpperCase() === "USER" || u.role?.toUpperCase() === "STUDENT").length,
        };
        setStats(statsData);
    };

    // Debounced search function
    const debouncedFilter = useCallback(
        debounce((filterState: FilterState) => {
            applyFilters(filterState);
        }, 300),
        [users]
    );

    useEffect(() => {
        debouncedFilter(filters);
    }, [filters, debouncedFilter, users]);

    const applyFilters = (filterState: FilterState) => {
        let result = [...users];

        // Search filter
        if (filterState.search) {
            const searchLower = filterState.search.toLowerCase();
            result = result.filter(
                (user) =>
                    (user.name?.toLowerCase().includes(searchLower) ?? false) ||
                    (user.email?.toLowerCase().includes(searchLower) ?? false)
            );
        }

        // Role filter
        if (filterState.role !== "all") {
            result = result.filter((user) => user.role?.toUpperCase() === filterState.role.toUpperCase());
        }

        // Status filter
        if (filterState.status !== "all") {
            result = result.filter((user) => (user.status ?? "").toUpperCase() === filterState.status.toUpperCase());
        }

        // Date range filter
        if (filterState.dateRange.from) {
            const fromDate = new Date(filterState.dateRange.from);
            result = result.filter((user) => new Date(user.createdAt) >= fromDate);
        }
        if (filterState.dateRange.to) {
            const toDate = new Date(filterState.dateRange.to);
            result = result.filter((user) => new Date(user.createdAt) <= toDate);
        }

        // Sorting
        result.sort((a, b) => {
            let aVal: any = a[filterState.sortBy];
            let bVal: any = b[filterState.sortBy];

            // If sorting by date, convert to timestamp
            if (filterState.sortBy === "createdAt") {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }

            if (filterState.sortOrder === "asc") {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });

        setFilteredUsers(result);
    };

    useEffect(() => {
        async function fetchDashboard() {
            try {
                setLoading(true);
                const usersRes = await apiGet("/api/admin/dashboard/users");

                if (usersRes.success) {
                    const usersData = usersRes.data || [];
                    setUsers(usersData);
                    setFilteredUsers(usersData);
                    calculateStats(usersData);
                } else {
                    toast.error("Failed to load users");
                }
            } catch (err: any) {
                console.error("Fetch error:", err);
                toast.error(err.message || "Failed to load users");
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleDateRangeChange = (key: "from" | "to", value: string) => {
        setFilters((prev) => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [key]: value,
            },
        }));
    };

    const handleSort = (column: FilterState["sortBy"]) => {
        setFilters((prev) => ({
            ...prev,
            sortBy: column,
            sortOrder: prev.sortBy === column && prev.sortOrder === "asc" ? "desc" : "asc",
        }));
    };

    const handleSelectUser = (id: string) => {
        setSelectedUsers((prev) =>
            prev.includes(id)
                ? prev.filter((userId) => userId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((user) => user.id));
        }
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedUsers.length === 0) return;

        // Implement bulk action API calls here
        console.log("Bulk action:", bulkAction, "on users:", selectedUsers);
        toast.info(`Bulk action "${bulkAction}" would be applied to ${selectedUsers.length} users`);

        // Reset after action
        setBulkAction("");
        setSelectedUsers([]);
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            role: "all",
            status: "all",
            dateRange: {
                from: "",
                to: "",
            },
            sortBy: "createdAt",
            sortOrder: "desc",
        });
    };

    const exportToCSV = () => {
        const headers = ["Name", "Email", "Role", "Status", "Created At", "Last Login"];
        const csvContent = [
            headers.join(","),
            ...filteredUsers.map((user) =>
                [
                    `"${user.name}"`,
                    `"${user.email}"`,
                    user.role,
                    user.status,
                    user.createdAt,
                    user.lastLogin || "N/A",
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Users exported to CSV");
    };

    // ✅ FIXED: Ban/Unban toggle with correct endpoint
    const handleBanToggle = async (userId: string, currentStatus: string) => {
        // Prevent multiple simultaneous requests
        if (processingUserId) {
            return;
        }

        setProcessingUserId(userId);

        try {
            // Determine new status
            const newStatus = currentStatus?.toUpperCase() === "BANNED" ? "ACTIVE" : "BANNED";

            // ✅ OPTION 1: Try with /api/admin prefix (most common)
            const endpoint = `/api/admin/users/${userId}/${newStatus === "BANNED" ? "ban" : "unban"}`;

            // ✅ OPTION 2: If the above doesn't work, try without /api/admin
            // const endpoint = `/users/${userId}/${newStatus === "BANNED" ? "ban" : "unban"}`;

            console.log("🔍 Ban request:", { userId, currentStatus, newStatus, endpoint });

            // Call the API
            const res = await apiPatch(endpoint, { status: newStatus });

            console.log("🔍 Ban response:", res);

            if (res.success) {
                const updatedStatus = res.data?.status || newStatus;

                // ✅ Update the main users array
                setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, status: updatedStatus } : u))
                );

                // ✅ Update the filtered users array
                setFilteredUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, status: updatedStatus } : u))
                );

                // ✅ Recalculate stats with updated data
                const updatedUsers = users.map((u) =>
                    u.id === userId ? { ...u, status: updatedStatus } : u
                );
                calculateStats(updatedUsers);

                toast.success(res.message || `User ${newStatus === "BANNED" ? "banned" : "unbanned"} successfully`);
            } else {
                throw new Error(res.message || "Failed to update user status");
            }
        } catch (err: any) {
            console.error("🔴 Ban toggle error:", err);
            toast.error(err.message || "Failed to update user status");
        } finally {
            setProcessingUserId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-1">Manage and monitor all user accounts</p>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="text-sm text-gray-500">Total Users</div>
                        <div className="text-3xl font-bold mt-2">{stats.total}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="text-sm text-gray-500">Active</div>
                        <div className="text-3xl font-bold mt-2 text-green-600">{stats.active}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="text-sm text-gray-500">Inactive</div>
                        <div className="text-3xl font-bold mt-2 text-gray-600">{stats.inactive}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="text-sm text-gray-500">Banned</div>
                        <div className="text-3xl font-bold mt-2 text-red-600">{stats.banned}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="text-sm text-gray-500">Admins</div>
                        <div className="text-3xl font-bold mt-2 text-blue-600">{stats.admins}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="text-sm text-gray-500">Regular Users</div>
                        <div className="text-3xl font-bold mt-2 text-purple-600">{stats.users}</div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Filters</h2>
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <RefreshCw size={16} />
                            Reset Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Role Filter */}
                        <div>
                            <select
                                value={filters.role}
                                onChange={(e) => handleFilterChange("role", e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="tutor">Tutor</option>
                                <option value="student">Student</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="banned">Banned</option>
                                <option value="pending">Pending</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={filters.dateRange.from}
                                onChange={(e) => handleDateRangeChange("from", e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                                placeholder="From"
                            />
                            <input
                                type="date"
                                value={filters.dateRange.to}
                                onChange={(e) => handleDateRangeChange("to", e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                                placeholder="To"
                            />
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-blue-700 font-medium">
                                    {selectedUsers.length} user(s) selected
                                </span>
                                <select
                                    value={bulkAction}
                                    onChange={(e) => setBulkAction(e.target.value)}
                                    className="px-4 py-2 border rounded-lg bg-white"
                                >
                                    <option value="">Bulk Actions</option>
                                    <option value="activate">Activate</option>
                                    <option value="deactivate">Deactivate</option>
                                    <option value="delete">Delete</option>
                                    <option value="assign_role">Assign Role</option>
                                </select>
                                <button
                                    onClick={handleBulkAction}
                                    disabled={!bulkAction}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Apply
                                </button>
                            </div>
                            <button
                                onClick={() => setSelectedUsers([])}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Clear selection
                            </button>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th
                                        className="p-4 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("name")}
                                    >
                                        Name {filters.sortBy === "name" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th
                                        className="p-4 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("email")}
                                    >
                                        Email {filters.sortBy === "email" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th
                                        className="p-4 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("role")}
                                    >
                                        Role {filters.sortBy === "role" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th
                                        className="p-4 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("status")}
                                    >
                                        Status {filters.sortBy === "status" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th
                                        className="p-4 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("createdAt")}
                                    >
                                        Created {filters.sortBy === "createdAt" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-500">
                                            No users found matching the current filters
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className={`hover:bg-gray-50 transition-colors ${user.status?.toUpperCase() === "BANNED" ? "bg-red-50" : ""
                                                }`}
                                        >
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                    className="rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="p-4 text-gray-600">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role?.toUpperCase() === "ADMIN"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : user.role?.toUpperCase() === "TUTOR"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${user.status?.toUpperCase() === "ACTIVE"
                                                    ? "bg-green-100 text-green-800"
                                                    : user.status?.toUpperCase() === "BANNED"
                                                        ? "bg-red-100 text-red-800"
                                                        : user.status?.toUpperCase() === "INACTIVE"
                                                            ? "bg-gray-100 text-gray-800"
                                                            : user.status?.toUpperCase() === "PENDING"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {user.status?.toUpperCase() === "ACTIVE" ? (
                                                        <CheckCircle size={14} />
                                                    ) : user.status?.toUpperCase() === "BANNED" || user.status?.toUpperCase() === "INACTIVE" ? (
                                                        <XCircle size={14} />
                                                    ) : null}
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {/* Delete button */}
                                                    <button
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete user"
                                                        onClick={() => toast.info("Delete functionality not implemented")}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>

                                                    {/* Ban / Unban button */}
                                                    <button
                                                        className={`p-2 rounded-lg transition-colors ${user.status?.toUpperCase() === "BANNED"
                                                            ? "text-green-600 hover:bg-green-50"
                                                            : "text-yellow-600 hover:bg-yellow-50"
                                                            } ${processingUserId === user.id ? "opacity-50 cursor-not-allowed" : ""
                                                            }`}
                                                        onClick={() => handleBanToggle(user.id, user.status)}
                                                        disabled={processingUserId === user.id}
                                                        title={user.status?.toUpperCase() === "BANNED" ? "Unban user" : "Ban user"}
                                                    >
                                                        {processingUserId === user.id ? (
                                                            <div className="animate-spin rounded-full h-[18px] w-[18px] border-b-2 border-current"></div>
                                                        ) : user.status?.toUpperCase() === "BANNED" ? (
                                                            <ShieldCheck size={18} />
                                                        ) : (
                                                            <Ban size={18} />
                                                        )}
                                                    </button>

                                                    {/* More options */}
                                                    <button
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="More options"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {filteredUsers.length} of {users.length} users
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50" disabled>
                                Previous
                            </button>
                            <span className="text-gray-700">Page 1 of 1</span>
                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50" disabled>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}