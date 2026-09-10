'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes.constants';
import { VERSION } from '@/version';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary'>
      {/* ─── Navigation Header ────────────────────────────────────────────── */}
      <header className='sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4 sm:px-6'>
          <div className='flex items-center gap-3'>
            <Image
              src='/assets/images/workinley-icon.svg'
              alt='Workinley'
              width={36}
              height={36}
              className='h-9 w-9 rounded-lg'
            />
            <div className='flex items-center gap-2'>
              <span className='text-xl font-bold tracking-tight text-primary'>Workinley</span>
              <Badge
                variant='outline'
                className='text-[10px] font-mono font-medium text-muted-foreground hidden sm:inline-flex border-border/80'
              >
                v{VERSION}
              </Badge>
            </div>
          </div>

          <nav className='hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground'>
            <a href='#features' className='hover:text-foreground transition-colors'>
              Features
            </a>
            <a href='#workflows' className='hover:text-foreground transition-colors'>
              Workflows
            </a>
            <a href='#analytics' className='hover:text-foreground transition-colors'>
              Analytics
            </a>
          </nav>

          <div className='flex items-center gap-3'>
            <Button variant='ghost' size='sm' asChild className='text-sm font-medium'>
              <Link href={ROUTES.SIGN_IN}>Sign In</Link>
            </Button>
            <Button size='sm' asChild id='nav-portal-btn' className='gap-1.5 shadow-sm'>
              <Link href={ROUTES.SAAS_ROOT}>
                Launch Portal
                <ArrowRight className='h-3.5 w-3.5' />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className='relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border/40'>
        {/* Background ambient radial gradients */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[750px] h-[400px] bg-gradient-to-tr from-primary/15 via-secondary/15 to-transparent blur-3xl opacity-70 pointer-events-none' />

        <div className='container mx-auto px-4 sm:px-6 flex flex-col items-center text-center'>
          {/* Eyebrow Pill */}
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6 shadow-xs'>
            <Sparkles className='h-3.5 w-3.5 text-secondary' />
            <span>Next-Generation Engineering Velocity & Reporting</span>
            <ChevronRight className='h-3 w-3 opacity-60' />
          </div>

          {/* Main Headline */}
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15]'>
            Effortless Weekly Reports.{' '}
            <span className='bg-gradient-to-r from-primary via-teal-600 to-secondary bg-clip-text text-transparent'>
              Crystal Clear Velocity.
            </span>
          </h1>

          {/* Subtitle */}
          <p className='mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed'>
            Empower developers and engineering managers with automated compliance tracking, blocker
            resolution, and structured progress digests built for high-performing teams.
          </p>

          {/* CTA Buttons */}
          <div className='mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto'>
            <Button
              size='lg'
              asChild
              id='hero-launch-portal-btn'
              className='w-full sm:w-auto h-12 px-8 text-base gap-2 font-semibold shadow-md shadow-primary/20'
            >
              <Link href={ROUTES.SAAS_ROOT}>
                Go to Portal
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
            <Button
              size='lg'
              variant='outline'
              asChild
              id='hero-signin-btn'
              className='w-full sm:w-auto h-12 px-8 text-base font-medium'
            >
              <Link href={ROUTES.SIGN_IN}>Sign In to Account</Link>
            </Button>
          </div>

          {/* Value Stat Pills */}
          <div className='mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 w-full max-w-2xl text-left'>
            <div className='p-3.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs'>
              <div className='text-xl sm:text-2xl font-bold text-foreground'>100%</div>
              <div className='text-xs text-muted-foreground mt-0.5'>Weekly Team Compliance</div>
            </div>
            <div className='p-3.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs'>
              <div className='text-xl sm:text-2xl font-bold text-primary'>Real-Time</div>
              <div className='text-xs text-muted-foreground mt-0.5'>Supervisor Review Queue</div>
            </div>
            <div className='col-span-2 sm:col-span-1 p-3.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs'>
              <div className='text-xl sm:text-2xl font-bold text-secondary'>Zero Friction</div>
              <div className='text-xs text-muted-foreground mt-0.5'>Task & Blocker Sync</div>
            </div>
          </div>
        </div>

        {/* Interactive App Preview Graphic */}
        <div className='container mx-auto px-4 sm:px-6 mt-14 max-w-5xl'>
          <div className='rounded-2xl border border-border/80 bg-card/70 p-2 sm:p-4 shadow-2xl backdrop-blur-md'>
            <div className='rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-6 space-y-4'>
              {/* Fake Window Controls */}
              <div className='flex items-center justify-between pb-3 border-b border-border/50'>
                <div className='flex items-center gap-1.5'>
                  <div className='w-3 h-3 rounded-full bg-red-500/80' />
                  <div className='w-3 h-3 rounded-full bg-amber-500/80' />
                  <div className='w-3 h-3 rounded-full bg-emerald-500/80' />
                  <span className='ml-3 text-xs font-mono text-muted-foreground'>
                    app.workinley.internal/portal
                  </span>
                </div>
                <Badge
                  variant='outline'
                  className='text-[10px] uppercase font-semibold text-emerald-600 bg-emerald-500/10 border-emerald-300 dark:border-emerald-800'
                >
                  Live System
                </Badge>
              </div>

              {/* Sample Metrics Strip */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                <div className='p-3 rounded-lg border border-border/60 bg-card'>
                  <span className='text-[11px] font-semibold text-muted-foreground uppercase'>
                    Active Members
                  </span>
                  <div className='text-2xl font-bold mt-1'>32</div>
                  <span className='text-[11px] text-emerald-600 font-medium'>+4 this month</span>
                </div>
                <div className='p-3 rounded-lg border border-border/60 bg-card'>
                  <span className='text-[11px] font-semibold text-muted-foreground uppercase'>
                    Compliance Rate
                  </span>
                  <div className='text-2xl font-bold text-primary mt-1'>94.5%</div>
                  <span className='text-[11px] text-muted-foreground'>Week 37 on track</span>
                </div>
                <div className='p-3 rounded-lg border border-border/60 bg-card'>
                  <span className='text-[11px] font-semibold text-muted-foreground uppercase'>
                    Reports Approved
                  </span>
                  <div className='text-2xl font-bold text-emerald-600 mt-1'>28</div>
                  <span className='text-[11px] text-muted-foreground'>4 pending review</span>
                </div>
                <div className='p-3 rounded-lg border border-border/60 bg-card'>
                  <span className='text-[11px] font-semibold text-muted-foreground uppercase'>
                    Active Blockers
                  </span>
                  <div className='text-2xl font-bold text-amber-500 mt-1'>2</div>
                  <span className='text-[11px] text-amber-600 font-medium'>1 key blocker</span>
                </div>
              </div>

              {/* Sample Table Row Mock */}
              <div className='rounded-lg border border-border/60 bg-card overflow-hidden text-xs'>
                <div className='grid grid-cols-12 px-4 py-2.5 bg-muted/40 font-semibold text-muted-foreground border-b border-border/50'>
                  <div className='col-span-4'>Team Member</div>
                  <div className='col-span-2'>Week</div>
                  <div className='col-span-3'>Project</div>
                  <div className='col-span-3 text-right'>Status</div>
                </div>
                <div className='grid grid-cols-12 px-4 py-3 items-center border-b border-border/40 hover:bg-muted/10'>
                  <div className='col-span-4 flex items-center gap-2 font-medium'>
                    <div className='h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]'>
                      AK
                    </div>
                    <span>Alex Khan</span>
                  </div>
                  <div className='col-span-2 text-muted-foreground'>W37 / 2026</div>
                  <div className='col-span-3 flex items-center gap-1.5'>
                    <span className='h-2 w-2 rounded-full bg-blue-500' />
                    <span>Mobile App v2</span>
                  </div>
                  <div className='col-span-3 text-right'>
                    <span className='inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'>
                      Approved
                    </span>
                  </div>
                </div>
                <div className='grid grid-cols-12 px-4 py-3 items-center hover:bg-muted/10'>
                  <div className='col-span-4 flex items-center gap-2 font-medium'>
                    <div className='h-6 w-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-[10px]'>
                      SR
                    </div>
                    <span>Sarah Reynolds</span>
                  </div>
                  <div className='col-span-2 text-muted-foreground'>W37 / 2026</div>
                  <div className='col-span-3 flex items-center gap-1.5'>
                    <span className='h-2 w-2 rounded-full bg-emerald-500' />
                    <span>Core Platform</span>
                  </div>
                  <div className='col-span-3 text-right'>
                    <span className='inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'>
                      Under Review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Pillars / Features ──────────────────────────────────────── */}
      <section id='features' className='py-20 bg-muted/15 border-b border-border/40'>
        <div className='container mx-auto px-4 sm:px-6'>
          <div className='text-center max-w-2xl mx-auto mb-16'>
            <h2 className='text-xs font-semibold uppercase tracking-widest text-primary'>
              Engineered for Clarity
            </h2>
            <p className='text-3xl font-bold tracking-tight text-foreground mt-2'>
              Everything high-performing teams need
            </p>
            <p className='text-sm text-muted-foreground mt-3'>
              Replace messy spreadsheets, manual check-ins, and fragmented chat updates with an
              intelligent, standardized reporting flow.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto'>
            <Card className='border-border/70 hover:border-primary/40 transition-all duration-200 hover:shadow-md'>
              <CardContent className='p-6 space-y-3'>
                <div className='h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center'>
                  <ClipboardCheck className='h-5 w-5' />
                </div>
                <h3 className='text-lg font-semibold text-foreground'>Structured Logs</h3>
                <p className='text-xs leading-relaxed text-muted-foreground'>
                  Capture completed achievements, planned deliverables, hours breakdown, and
                  blockers in an intuitive slide-out sheet interface.
                </p>
              </CardContent>
            </Card>

            <Card className='border-border/70 hover:border-primary/40 transition-all duration-200 hover:shadow-md'>
              <CardContent className='p-6 space-y-3'>
                <div className='h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center'>
                  <TrendingUp className='h-5 w-5' />
                </div>
                <h3 className='text-lg font-semibold text-foreground'>Executive Velocity</h3>
                <p className='text-xs leading-relaxed text-muted-foreground'>
                  Gain visibility into team-wide hour distributions, project workloads, and velocity
                  metrics to optimize resource planning.
                </p>
              </CardContent>
            </Card>

            <Card className='border-border/70 hover:border-primary/40 transition-all duration-200 hover:shadow-md'>
              <CardContent className='p-6 space-y-3'>
                <div className='h-11 w-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center'>
                  <AlertTriangle className='h-5 w-5' />
                </div>
                <h3 className='text-lg font-semibold text-foreground'>Blocker Radar</h3>
                <p className='text-xs leading-relaxed text-muted-foreground'>
                  Surface critical dependencies, blockers, and friction points immediately so team
                  leaders can intervene and unblock progress quickly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Role-Based Workflows ─────────────────────────────────────────── */}
      <section id='workflows' className='py-20 border-b border-border/40'>
        <div className='container mx-auto px-4 sm:px-6 max-w-6xl'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
            <div className='space-y-6'>
              <div>
                <Badge
                  variant='outline'
                  className='text-xs font-semibold uppercase text-primary border-primary/30'
                >
                  Staff & Leadership
                </Badge>
                <h3 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2'>
                  Executive Command Center for Managers & Admins
                </h3>
                <p className='text-sm text-muted-foreground mt-3 leading-relaxed'>
                  Staff members get a consolidated command center to review weekly reports, oversee
                  team compliance matrices, track active blockers, and manage projects.
                </p>
              </div>

              <div className='space-y-3.5 text-xs'>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='h-4 w-4 text-secondary shrink-0 mt-0.5' />
                  <span>One-click approvals and feedback comments on weekly submissions</span>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='h-4 w-4 text-secondary shrink-0 mt-0.5' />
                  <span>Interactive compliance matrix tracking who has submitted each week</span>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='h-4 w-4 text-secondary shrink-0 mt-0.5' />
                  <span>Full project lifecycle management and team member oversight</span>
                </div>
              </div>

              <Button asChild size='sm' className='gap-2'>
                <Link href={ROUTES.STAFF_DASHBOARD}>
                  View Staff Portal
                  <ArrowRight className='h-3.5 w-3.5' />
                </Link>
              </Button>
            </div>

            <div className='space-y-6 lg:pl-6'>
              <div>
                <Badge
                  variant='outline'
                  className='text-xs font-semibold uppercase text-secondary border-secondary/30'
                >
                  Engineers & Members
                </Badge>
                <h3 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2'>
                  Frictionless Personal Dashboard for Team Members
                </h3>
                <p className='text-sm text-muted-foreground mt-3 leading-relaxed'>
                  Engineers can focus on coding. The member dashboard gives instant feedback on
                  current week deadlines, saved drafts, and historical approvals.
                </p>
              </div>

              <div className='space-y-3.5 text-xs'>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='h-4 w-4 text-primary shrink-0 mt-0.5' />
                  <span>Prominent action banners for pending or draft weekly submissions</span>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='h-4 w-4 text-primary shrink-0 mt-0.5' />
                  <span>Card-based project exploration tailored specifically for members</span>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='h-4 w-4 text-primary shrink-0 mt-0.5' />
                  <span>
                    Personal KPI cards for approved reports, total tasks, and revision history
                  </span>
                </div>
              </div>

              <Button asChild size='sm' variant='outline' className='gap-2'>
                <Link href={ROUTES.USER_DASHBOARD}>
                  View Member Dashboard
                  <ArrowRight className='h-3.5 w-3.5' />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom Call-to-Action ────────────────────────────────────────── */}
      <section className='py-20 relative overflow-hidden'>
        <div className='container mx-auto px-4 sm:px-6 max-w-4xl'>
          <div className='rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8 sm:p-12 text-center shadow-lg relative'>
            <h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground'>
              Ready to elevate your engineering cadence?
            </h2>
            <p className='text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mt-3'>
              Access your Workinley workspace now to create reports, review velocity, and align with
              your team.
            </p>

            <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-3'>
              <Button
                size='lg'
                asChild
                id='footer-launch-portal-btn'
                className='h-12 px-8 text-base gap-2 font-semibold shadow-md'
              >
                <Link href={ROUTES.SAAS_ROOT}>
                  Open Portal
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                asChild
                id='footer-signin-btn'
                className='h-12 px-8 text-base font-medium'
              >
                <Link href={ROUTES.SIGN_IN}>Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className='border-t border-border/50 py-8 bg-muted/20 text-xs text-muted-foreground'>
        <div className='container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <Image
              src='/assets/images/workinley-icon.svg'
              alt='Workinley'
              width={22}
              height={22}
              className='h-5 w-5 rounded-md'
            />
            <span className='font-semibold text-foreground'>Workinley</span>
            <span>· Internal Engineering Velocity & Reporting Tool</span>
          </div>
          <div className='flex items-center gap-6'>
            <Link href={ROUTES.SAAS_ROOT} className='hover:text-foreground transition-colors'>
              Portal
            </Link>
            <Link href={ROUTES.SIGN_IN} className='hover:text-foreground transition-colors'>
              Sign In
            </Link>
            <span className='font-mono'>v{VERSION}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
