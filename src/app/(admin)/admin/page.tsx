/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
    getDashboardSummary,
    getUpcomingBookings,
    getRecentBookings,
    getLearningProgress,
    getQuickActions,
} from "@/lib/student-dashboard.api";
import {
    Calendar,
    Clock,
    DollarSign,
    BookOpen,
    TrendingUp,
    UserCheck,
    Star,
    CheckCircle,
    AlertCircle,
    XCircle,
    Users,
    BarChart3,
    Target,
    Zap,
    Sparkles,
    MoreVertical,
    MessageSquare,
    Video,
    Brain,
    FileText,
    Bell,
    ThumbsUp,
    ChevronRight,
    Download,
    Award,
    Trophy,
    TrendingDown,
    BookMarked,
    GraduationCap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui2/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui2/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui2/skeleton";

export default function TutorDashboardPage() {


    return (
        <div className="space-y-8 p-4 md:p-6">
            dashboad conente goes here
        </div>
    );
}

