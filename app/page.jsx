'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Video, Zap, Brain, Shield, Globe, Mic, Users, BarChart3, ArrowRight,
  Github, Twitter, Check, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FEATURES = [
  {
    icon: Video,
    title: 'HD Video Mesh',
    description: 'WebRTC peer-to-peer mesh topology for ultra-low latency, up to 50 participants.',
    color: 'text-brand-violet',
  },
  {
    icon: Brain,
    title: 'AI Transcription',
    description: 'Live transcription powered by Claude claude-sonnet-4-6 with speaker identification.',
    color: 'text-brand-cyan',
  },
  {
    icon: Zap,
    title: 'Smart Summaries',
    description: 'Post-meeting AI intelligence reports: decisions, action items, sentiment analysis.',
    color: 'text-yellow-400',
  },
  {
    icon: Mic,
    title: 'AI Assistant',
    description: 'Ask ARIA questions mid-call. Get instant context-aware answers from your meeting.',
    color: 'text-pink-400',
  },
  {
    icon: Shield,
    title: 'End-to-End Security',
    description: 'Clerk authentication, rate-limited APIs, helmet headers, and secure TURN servers.',
    color: 'text-green-400',
  },
  {
    icon: BarChart3,
    title: 'Meeting Analytics',
    description: 'Engagement metrics, sentiment timelines, speaking time distribution per participant.',
    color: 'text-orange-400',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for individuals and small teams.',
    features: ['Up to 5 participants', '40-minute meetings', 'HD video', 'Chat & reactions', 'Basic AI summary'],
    cta: 'Get started',
    href: '/sign-up',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For teams that need more power.',
    features: ['Up to 50 participants', 'Unlimited meetings', 'HD + screen share', 'Full AI transcription', 'Smart summaries & action items', 'Recording (Cloudinary)', 'Priority support'],
    cta: 'Start free trial',
    href: '/sign-up',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with advanced needs.',
    features: ['Unlimited participants', 'SFU architecture', 'Custom AI pipelines', 'SSO & SCIM', 'SLA guarantee', 'Dedicated support', 'On-premise option'],
    cta: 'Contact sales',
    href: 'mailto:sales@rohan.app',
    popular: false,
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gradient">Live Meet</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-brand-violet hover:bg-brand-violet/90 text-white">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background mesh gradient */}
        <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-violet/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-brand-violet/10 text-brand-violet border-brand-violet/20 hover:bg-brand-violet/20">
              <Star className="w-3 h-3 mr-1" />
              Powered by Claude claude-sonnet-4-6
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-display font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Meetings that{' '}
            <span className="text-gradient">think for you</span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Rohan brings crystal-clear WebRTC video together with Claude AI intelligence.
            Every meeting feels natural, gets transcribed, and leaves you with instant action items.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/sign-up">
              <Button size="lg" className="bg-brand-violet hover:bg-brand-violet/90 text-white gap-2 text-base px-8 shadow-lg shadow-brand-violet/25">
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 border-border/60">
                <Video className="w-4 h-4" />
                Go to dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glass-strong rounded-2xl border border-border/50 p-4 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1" />
                <div className="text-xs text-muted-foreground font-mono">rohan.app/room/a7k3m9xq</div>
              </div>
              <div className="bg-brand-navy rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-2 gap-3 w-full h-full p-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="video-tile bg-brand-navy-light flex items-center justify-center rounded-lg relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center text-white font-bold text-lg">
                        {['R', 'A', 'S', 'M'][i]}
                      </div>
                      {i === 0 && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                          <span className="text-xs text-white/80">Rohan (You)</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* AI Transcription overlay */}
                <div className="absolute bottom-4 left-4 right-4 glass rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-3.5 h-3.5 text-brand-cyan" />
                    <span className="text-xs text-brand-cyan font-medium">ARIA • Live Transcription</span>
                  </div>
                  <p className="text-xs text-muted-foreground">"...the Q3 roadmap should prioritize the API integration, then we can discuss the UI refresh in the next sprint..."</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-display font-bold mb-4">
              Everything you need to{' '}
              <span className="text-gradient">collaborate smarter</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built from the ground up with performance, security, and AI intelligence at every layer.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="glass rounded-xl p-6 hover:border-border transition-all group"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Simple, transparent <span className="text-gradient">pricing</span>
            </h2>
            <p className="text-muted-foreground text-lg">Start free, scale as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`relative glass rounded-2xl p-8 flex flex-col ${plan.popular ? 'border-brand-violet/50 shadow-lg shadow-brand-violet/10' : ''}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-violet text-white border-0 px-4">Most popular</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">{plan.name}</div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-display font-black">{plan.price}</span>
                    <span className="text-muted-foreground mb-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-brand-cyan mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-brand-violet hover:bg-brand-violet/90 text-white' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-gradient">Rohan</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rohan. Built to make meetings feel more human.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener">
              <Twitter className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
