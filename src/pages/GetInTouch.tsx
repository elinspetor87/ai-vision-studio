
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { contactService } from '@/services/contactService';
import { toast } from 'sonner';
import { Mail, User, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const GetInTouch = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const mutation = useMutation({
        mutationFn: (data: typeof formData) => contactService.submitContactForm(data),
        onSuccess: (data) => {
            toast.success(data.message || 'Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to send message. Please try again.';
            toast.error(message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navigation />

            <main className="flex-1 pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-16 space-y-4">
                            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                                Get in <span className="text-primary">Touch</span>
                            </h1>
                            <p className="font-body text-xl text-muted-foreground flex items-center justify-center gap-2">
                                Let's create something extraordinary together.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
                            {/* Contact Info */}
                            <div className="md:col-span-2 space-y-8">
                                <div className="p-8 bg-secondary/30 border border-border rounded-2xl backdrop-blur-sm space-y-6">
                                    <h3 className="font-display text-2xl font-semibold">Contact Information</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider">Email</p>
                                                <p className="font-body">contact@felipealmeida.studio</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border/50">
                                        <p className="text-sm text-muted-foreground italic">
                                            "Filmmaking is a chance to live many lives."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="md:col-span-3">
                                <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-8 rounded-2xl shadow-xl shadow-primary/5">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-primary" />
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                required
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="bg-background/50 border-border focus:ring-primary/20 bg-secondary/20"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-primary" />
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="your@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="bg-background/50 border-border focus:ring-primary/20 bg-secondary/20"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-primary" />
                                                Your Message
                                            </Label>
                                            <Textarea
                                                id="message"
                                                required
                                                placeholder="Tell me about your project..."
                                                rows={6}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="bg-background/50 border-border focus:ring-primary/20 bg-secondary/20 resize-none"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full gap-2 text-lg h-14 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
                                        disabled={mutation.isPending}
                                    >
                                        {mutation.isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GetInTouch;
