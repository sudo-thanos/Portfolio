"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Rocket, TrendingUp, Eye } from "lucide-react";

export default function LabOverviewPage() {
    const labStats = [
        {
            label: "Total Projects",
            value: "12",
            icon: Rocket,
            change: "+2 this month",
        },
        {
            label: "Case Studies",
            value: "8",
            icon: FileText,
            change: "+1 this week",
        },
        {
            label: "Technologies",
            value: "4",
            icon: TrendingUp,
            change: "No change",
        },
        {
            label: "Page Views",
            value: "2.4k",
            icon: Eye,
            change: "+12% this month",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Welcome back, Daniel!
                </h2>
                <p className="text-muted-foreground mt-2">
                    Here&apos;s what&apos;s happening with your innovation
                    projects today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {labStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    {stat.label}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Updates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Rocket className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">
                                    New project added
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Teacher-on-Demand Platform published
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    2 hours ago
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">
                                    Case study updated
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    DLSim metrics refreshed
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    1 day ago
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <Rocket className="mr-2 h-4 w-4" />
                            Add New Project
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Create Case Study
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Update Technologies
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
