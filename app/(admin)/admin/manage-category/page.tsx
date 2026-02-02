/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { apiGet, apiPatch, apiPost, apiDelete } from "@/lib/api";
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Check,
    X,
    MoreVertical,
    Calendar,
    RefreshCw,
    SortAsc,
    SortDesc,
    Download,
    ChevronDown,
    AlertCircle
} from "lucide-react";

type Category = {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    usageCount?: number;
};

type FilterState = {
    search: string;
    status: "all" | "active" | "inactive";
    sortBy: "name" | "createdAt" | "updatedAt" | "usageCount";
    sortOrder: "asc" | "desc";
    dateRange: {
        from: string;
        to: string;
    };
};

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });
    const [isCreating, setIsCreating] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: "", description: "" });

    // Filter states
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        status: "all",
        sortBy: "createdAt",
        sortOrder: "desc",
        dateRange: { from: "", to: "" }
    });

    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    async function fetchCategories() {
        try {
            setError(null);
            const res = await apiGet("/api/admin/categories");
            if (res.success) {
                setCategories(res.data.map((cat: Category) => ({
                    ...cat,
                    usageCount: Math.floor(Math.random() * 100) // Mock data - replace with actual
                })));
            } else {
                setError("Failed to fetch categories");
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch categories");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    // Filter and sort categories
    const filteredCategories = useMemo(() => {
        let result = [...categories];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(cat =>
                cat.name.toLowerCase().includes(searchLower) ||
                cat.description.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (filters.status !== "all") {
            result = result.filter(cat =>
                filters.status === "active" ? cat.isActive : !cat.isActive
            );
        }

        // Date range filter
        if (filters.dateRange.from) {
            result = result.filter(cat =>
                new Date(cat.createdAt) >= new Date(filters.dateRange.from)
            );
        }
        if (filters.dateRange.to) {
            result = result.filter(cat =>
                new Date(cat.createdAt) <= new Date(filters.dateRange.to)
            );
        }

        // Sorting
        result.sort((a, b) => {
            let aVal, bVal;

            switch (filters.sortBy) {
                case "name":
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    break;
                case "createdAt":
                case "updatedAt":
                    aVal = new Date(a[filters.sortBy]).getTime();
                    bVal = new Date(b[filters.sortBy]).getTime();
                    break;
                case "usageCount":
                    aVal = a.usageCount || 0;
                    bVal = b.usageCount || 0;
                    break;
                default:
                    aVal = a.name;
                    bVal = b.name;
            }

            if (filters.sortOrder === "asc") {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return result;
    }, [categories, filters]);

    // Stats
    const stats = useMemo(() => ({
        total: categories.length,
        active: categories.filter(c => c.isActive).length,
        inactive: categories.filter(c => !c.isActive).length,
        recentlyAdded: categories.filter(c =>
            new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
    }), [categories]);

    // Create category
    async function handleCreate() {
        if (!newCategory.name.trim()) {
            setError("Category name is required");
            return;
        }

        try {
            setIsCreating(true);
            setError(null);
            const res = await apiPost("/api/admin/categories", newCategory);
            if (res.success) {
                setCategories([{ ...res.data, usageCount: 0 }, ...categories]);
                setNewCategory({ name: "", description: "" });
                setSuccessMessage("Category created successfully!");
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (err: any) {
            setError(err.message || "Failed to create category");
        } finally {
            setIsCreating(false);
        }
    }

    // Start editing
    function startEdit(category: Category) {
        setEditCategoryId(category.id);
        setEditForm({ name: category.name, description: category.description });
    }

    // Cancel editing
    function cancelEdit() {
        setEditCategoryId(null);
        setEditForm({ name: "", description: "" });
    }

    // Update category
    async function handleUpdate(categoryId: string) {
        if (!editForm.name.trim()) {
            setError("Category name is required");
            return;
        }

        try {
            setError(null);
            const res = await apiPatch(`/api/admin/categories/${categoryId}`, {
                name: editForm.name,
                description: editForm.description,
            });
            if (res.success) {
                setCategories(categories.map(cat =>
                    cat.id === categoryId ? { ...res.data, usageCount: cat.usageCount } : cat
                ));
                setEditCategoryId(null);
                setSuccessMessage("Category updated successfully!");
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (err: any) {
            setError(err.message || "Failed to update category");
        }
    }

    // Toggle category status
    async function toggleStatus(categoryId: string, currentStatus: boolean) {
        try {
            setError(null);
            const endpoint = currentStatus ? "deactivate" : "activate";
            const res = await apiPatch(`/api/admin/categories/${categoryId}/${endpoint}`, {});
            if (res.success) {
                setCategories(categories.map(cat =>
                    cat.id === categoryId ? { ...cat, isActive: !currentStatus } : cat
                ));
                setSuccessMessage(`Category ${currentStatus ? 'deactivated' : 'activated'}!`);
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (err: any) {
            setError(err.message || `Failed to ${currentStatus ? 'deactivate' : 'activate'} category`);
        }
    }

    // Delete category
    async function handleDelete(categoryId: string) {
        if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;

        try {
            setError(null);
            const res = await apiDelete(`/api/admin/categories/${categoryId}`);
            if (res.success) {
                setCategories(categories.filter(cat => cat.id !== categoryId));
                setSuccessMessage("Category deleted successfully!");
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (err: any) {
            setError(err.message || "Failed to delete category");
        }
    }

    // Bulk actions
    async function handleBulkAction(action: "activate" | "deactivate" | "delete") {
        if (selectedCategories.length === 0) {
            setError("No categories selected");
            return;
        }

        const actionMap = {
            activate: "activate",
            deactivate: "deactivate",
            delete: "delete"
        };

        const confirmMessage = action === "delete"
            ? `Are you sure you want to delete ${selectedCategories.length} category(ies)? This cannot be undone.`
            : `Are you sure you want to ${action} ${selectedCategories.length} category(ies)?`;

        if (!confirm(confirmMessage)) return;

        try {
            setError(null);
            // In a real app, you would make bulk API calls here
            // For now, simulate individual updates
            if (action === "delete") {
                setCategories(categories.filter(cat => !selectedCategories.includes(cat.id)));
            } else {
                setCategories(categories.map(cat =>
                    selectedCategories.includes(cat.id)
                        ? { ...cat, isActive: action === "activate" }
                        : cat
                ));
            }

            setSelectedCategories([]);
            setSuccessMessage(`Bulk ${action} completed successfully!`);
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.message || `Failed to perform bulk ${action}`);
        }
    }

    // Export to CSV
    function exportToCSV() {
        const headers = ["Name", "Description", "Status", "Created At", "Usage Count"];
        const csvContent = [
            headers.join(","),
            ...filteredCategories.map(cat => [
                `"${cat.name}"`,
                `"${cat.description}"`,
                cat.isActive ? "Active" : "Inactive",
                new Date(cat.createdAt).toISOString().split('T')[0],
                cat.usageCount || 0
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `categories_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }

    // Reset filters
    function resetFilters() {
        setFilters({
            search: "",
            status: "all",
            sortBy: "createdAt",
            sortOrder: "desc",
            dateRange: { from: "", to: "" }
        });
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
                            <p className="text-gray-600 mt-1">Create, edit, and manage content categories</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Download size={18} />
                                Export
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter size={18} />
                                Filters {showFilters ? <ChevronDown className="rotate-180" size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="text-sm text-gray-500">Total Categories</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="text-sm text-gray-500">Active</div>
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="text-sm text-gray-500">Inactive</div>
                            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="text-sm text-gray-500">Recently Added</div>
                            <div className="text-2xl font-bold text-blue-600">{stats.recentlyAdded}</div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <div className="text-red-700">{error}</div>
                        <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="text-green-700">{successMessage}</div>
                        <button onClick={() => setSuccessMessage(null)} className="ml-auto text-green-600 hover:text-green-800">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mb-6 bg-white rounded-xl shadow-sm border p-6 animate-in fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                            >
                                <RefreshCw size={16} />
                                Reset
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={filters.search}
                                        onChange={e => setFilters({ ...filters, search: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={e => setFilters({ ...filters, status: e.target.value as any })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={e => setFilters({ ...filters, sortBy: e.target.value as any })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="name">Name</option>
                                    <option value="createdAt">Created Date</option>
                                    <option value="updatedAt">Updated Date</option>
                                    <option value="usageCount">Usage Count</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilters({ ...filters, sortOrder: "asc" })}
                                        className={`flex-1 px-4 py-2 border rounded-lg flex items-center justify-center gap-2 ${filters.sortOrder === "asc"
                                            ? "bg-blue-50 border-blue-500 text-blue-700"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <SortAsc size={16} />
                                        Asc
                                    </button>
                                    <button
                                        onClick={() => setFilters({ ...filters, sortOrder: "desc" })}
                                        className={`flex-1 px-4 py-2 border rounded-lg flex items-center justify-center gap-2 ${filters.sortOrder === "desc"
                                            ? "bg-blue-50 border-blue-500 text-blue-700"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <SortDesc size={16} />
                                        Desc
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Created Date Range</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">From</span>
                                    </div>
                                    <input
                                        type="date"
                                        value={filters.dateRange.from}
                                        onChange={e => setFilters({
                                            ...filters,
                                            dateRange: { ...filters.dateRange, from: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">To</span>
                                    </div>
                                    <input
                                        type="date"
                                        value={filters.dateRange.to}
                                        onChange={e => setFilters({
                                            ...filters,
                                            dateRange: { ...filters.dateRange, to: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Category Form */}
                <div className="mb-6 bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus size={20} />
                        Create New Category
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Web Development"
                                value={newCategory.name}
                                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <input
                                type="text"
                                placeholder="Brief description of the category"
                                value={newCategory.description}
                                onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleCreate}
                                disabled={isCreating || !newCategory.name.trim()}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Create Category
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedCategories.length > 0 && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-blue-700 font-medium">
                                    {selectedCategories.length} category(ies) selected
                                </span>
                                <select
                                    onChange={(e) => handleBulkAction(e.target.value as any)}
                                    className="px-4 py-2 border rounded-lg bg-white text-sm"
                                >
                                    <option value="">Bulk Actions</option>
                                    <option value="activate">Activate</option>
                                    <option value="deactivate">Deactivate</option>
                                    <option value="delete">Delete</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setSelectedCategories([])}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Clear selection
                            </button>
                        </div>
                    </div>
                )}

                {/* Categories Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                                            onChange={() => {
                                                if (selectedCategories.length === filteredCategories.length) {
                                                    setSelectedCategories([]);
                                                } else {
                                                    setSelectedCategories(filteredCategories.map(c => c.id));
                                                }
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Category</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Usage</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Created</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Filter size={48} className="text-gray-300 mb-4" />
                                                <div className="text-lg font-medium text-gray-900 mb-2">No categories found</div>
                                                <p className="text-gray-600">Try adjusting your filters or create a new category</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map(category => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category.id)}
                                                    onChange={() => {
                                                        if (selectedCategories.includes(category.id)) {
                                                            setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                                                        } else {
                                                            setSelectedCategories([...selectedCategories, category.id]);
                                                        }
                                                    }}
                                                    className="rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="p-4">
                                                {editCategoryId === category.id ? (
                                                    <div className="space-y-3">
                                                        <input
                                                            type="text"
                                                            value={editForm.name}
                                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                                            placeholder="Category name"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={editForm.description}
                                                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                                            placeholder="Description"
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleUpdate(category.id)}
                                                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="font-medium text-gray-900">{category.name}</div>
                                                        <div className="text-sm text-gray-600 mt-1">{category.description}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${category.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {category.isActive ? (
                                                        <>
                                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                                            Inactive
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{
                                                                width: `${Math.min(100, ((category.usageCount || 0) / 100) * 100)}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-700">{category.usageCount || 0}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-gray-700">
                                                    {new Date(category.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(category.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {editCategoryId === category.id ? null : (
                                                        <>
                                                            <button
                                                                onClick={() => startEdit(category)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => toggleStatus(category.id, category.isActive)}
                                                                className={`p-2 rounded-lg transition-colors ${category.isActive
                                                                    ? 'text-orange-600 hover:bg-orange-50'
                                                                    : 'text-green-600 hover:bg-green-50'
                                                                    }`}
                                                                title={category.isActive ? "Deactivate" : "Activate"}
                                                            >
                                                                {category.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(category.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            Showing {filteredCategories.length} of {categories.length} categories
                            {filters.search && ` • "${filters.search}"`}
                            {filters.status !== 'all' && ` • ${filters.status}`}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Page 1 of {Math.ceil(filteredCategories.length / 10)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}