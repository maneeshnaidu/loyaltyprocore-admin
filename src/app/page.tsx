import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="LoyaltyPro Logo"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="text-xl font-bold">LoyaltyPro</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                        <Link href="/register">
                            <Button>Get Started</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-24 md:pt-32 container">
                <div className="flex flex-col items-center text-center space-y-8 pb-12">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Reward Your Customers,{" "}
                        <span className="text-primary">Grow Your Business</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-[600px]">
                        Transform your business with our powerful rewards platform.
                        Engage customers, drive loyalty, and boost revenue.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/register">
                            <Button size="lg" className="h-12 px-8">
                                Start Free Trial
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="outline" className="h-12 px-8">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                    <div className="pt-8">
                        <Image
                            src="/app-preview.png"
                            alt="App Preview"
                            width={800}
                            height={400}
                            className="rounded-lg shadow-2xl"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">
                        Everything You Need to Succeed
                    </h2>
                    <p className="text-muted-foreground">
                        Powerful features to help you manage and grow your loyalty program
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Digital Rewards"
                        description="Create and manage digital rewards that your customers will love"
                        icon="🎁"
                    />
                    <FeatureCard
                        title="Customer Analytics"
                        description="Get deep insights into customer behavior and preferences"
                        icon="📊"
                    />
                    <FeatureCard
                        title="Mobile App"
                        description="Engage customers with our beautiful mobile application"
                        icon="📱"
                    />
                    <FeatureCard
                        title="Points System"
                        description="Flexible points system that adapts to your business"
                        icon="⭐"
                    />
                    <FeatureCard
                        title="Integration Ready"
                        description="Easy integration with your existing systems"
                        icon="🔄"
                    />
                    <FeatureCard
                        title="Real-time Updates"
                        description="Keep your customers informed with real-time notifications"
                        icon="⚡"
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary/5 py-16">
                <div className="container">
                    <Card className="bg-primary/10 border-0">
                        <CardContent className="p-12 flex flex-col items-center text-center space-y-6">
                            <h2 className="text-3xl font-bold">
                                Ready to Transform Your Business?
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-[600px]">
                                Join thousands of businesses already using LoyaltyPro to grow their customer base.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/register">
                                    <Button size="lg" className="h-12 px-8">
                                        Start Free Trial
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="h-12 px-8">
                                        Contact Sales
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t mt-auto">
                <div className="container py-8 md:py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-semibold">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#">Features</Link></li>
                                <li><Link href="#">Pricing</Link></li>
                                <li><Link href="#">Integrations</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#">About</Link></li>
                                <li><Link href="#">Blog</Link></li>
                                <li><Link href="#">Careers</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold">Resources</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#">Documentation</Link></li>
                                <li><Link href="#">Help Center</Link></li>
                                <li><Link href="#">Support</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#">Privacy</Link></li>
                                <li><Link href="#">Terms</Link></li>
                                <li><Link href="#">Security</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} LoyaltyPro. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({
    title,
    description,
    icon,
}: {
    title: string
    description: string
    icon: string
}) {
    return (
        <Card>
            <CardHeader>
                <div className="text-3xl mb-2">{icon}</div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
        </Card>
    )
}