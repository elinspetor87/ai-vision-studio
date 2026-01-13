import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Loader2, ArrowUpDown, Download, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import axios from 'axios';

import { newsletterService } from '@/services/newsletterService';

const NewsletterManagement = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);

    const { data, isLoading } = useQuery({
        queryKey: ['subscribers', page, filterActive],
        queryFn: () => newsletterService.getAllSubscribers(page, 50, filterActive),
    });

    const { data: stats } = useQuery({
        queryKey: ['newsletter-stats'],
        queryFn: () => newsletterService.getStats(),
    });

    const unsubscribeMutation = useMutation({
        mutationFn: (email: string) => newsletterService.unsubscribe(email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscribers'] });
            queryClient.invalidateQueries({ queryKey: ['newsletter-stats'] });
            toast.success('Subscriber unsubscribed successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to unsubscribe user');
        },
    });

    const handleExport = () => {
        if (!data?.data) return;

        // Convert to CSV
        const csvContent =
            "data:text/csv;charset=utf-8," +
            "Email,Status,Subscribed At,Source\n" +
            data.data.map((sub: any) =>
                `${sub.email},${sub.isActive ? 'Active' : 'Inactive'},${sub.subscribedAt},${sub.source || 'blog'}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "newsletter_subscribers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold">Newsletter Subscribers</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your newsletter audience
                    </p>
                </div>
                <Button onClick={handleExport} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-card border border-border p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
                    <p className="text-3xl font-bold mt-2">{stats?.data?.total || 0}</p>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground">Active Subscribers</p>
                    <p className="text-3xl font-bold mt-2 text-green-500">{stats?.data?.active || 0}</p>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground">Unsubscribed</p>
                    <p className="text-3xl font-bold mt-2 text-red-500">{stats?.data?.inactive || 0}</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex gap-2">
                    <Button
                        variant={filterActive === undefined ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilterActive(undefined)}
                    >
                        All
                    </Button>
                    <Button
                        variant={filterActive === true ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilterActive(true)}
                    >
                        Active
                    </Button>
                    <Button
                        variant={filterActive === false ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilterActive(false)}
                    >
                        Inactive
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Subscribed At</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No subscribers found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.data?.map((subscriber: any) => (
                                <TableRow key={subscriber._id}>
                                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                                    <TableCell>
                                        {subscriber.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                                <CheckCircle className="w-3 h-3" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                                <XCircle className="w-3 h-3" />
                                                Inactive
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="capitalize">{subscriber.source || 'blog'}</TableCell>
                                    <TableCell>
                                        {format(new Date(subscriber.subscribedAt), 'MMM dd, yyyy HH:mm')}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {subscriber.isActive && (
                                                    <DropdownMenuItem
                                                        className="text-red-500"
                                                        onClick={() => unsubscribeMutation.mutate(subscriber.email)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Unsubscribe
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination if needed */}
                {data?.pagination?.pages > 1 && (
                    <div className="flex items-center justify-end p-4 border-t border-border gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {page} of {data.pagination.pages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page === data.pagination.pages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsletterManagement;
