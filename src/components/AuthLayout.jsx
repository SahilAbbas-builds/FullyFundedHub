import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Globe2, Sparkles, ShieldCheck } from "lucide-react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="relative min-h-screen w-full flex bg-background overflow-hidden">

      {/* ================= LEFT: VISUAL PANEL (lg and up only) ================= */}
      <div className="hidden lg:flex relative w-1/2 xl:w-[45%] flex-col justify-between overflow-hidden p-12 xl:p-16 border-r border-white/5">
        {/* base gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-2 via-background to-surface-1" />

        {/* ambient blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/20 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-accent/20 blur-3xl animate-float-slower" />
        <div className="pointer-events-none absolute top-1/3 right-1/4 w-[220px] h-[220px] rounded-full bg-highlight/10 blur-3xl animate-drift" />

        {/* subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />

        {/* floating glass shapes */}
        <div className="pointer-events-none absolute top-20 right-16 w-16 h-16 rounded-2xl glass-card animate-bob" />
        <div
          className="pointer-events-none absolute bottom-32 left-10 w-12 h-12 rounded-full glass-card animate-bob"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/3 w-10 h-10 rounded-xl glass-card animate-bob"
          style={{ animationDelay: "3s" }}
        />

        {/* brand mark */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <GraduationCap className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground">FullyFundedHub</span>
        </motion.div>

        {/* headline block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-md"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">Trusted by students worldwide</span>
          </div>
          <h2 className="font-heading text-4xl xl:text-[2.75rem] leading-[1.1] font-bold text-foreground mb-4">
            Your fully funded
            <br />
            <span className="gradient-text">future starts here</span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Track deadlines, save opportunities, and unlock scholarships and fellowships from around the world — all in one place.
          </p>
        </motion.div>

        {/* trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 flex items-center gap-8"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg glass-card flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Global</div>
              <div className="text-xs text-muted-foreground">Opportunities</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg glass-card flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Verified</div>
              <div className="text-xs text-muted-foreground">Listings</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= RIGHT: FORM PANEL ================= */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 py-12 overflow-hidden">
        {/* mobile-only ambient glow (visual panel hidden below lg) */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl lg:opacity-40" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl lg:opacity-40" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md"
        >
          {/* mobile brand mark (hidden on lg, since left panel has it there) */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <GraduationCap className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="font-heading text-lg font-bold text-foreground">FullyFundedHub</span>
          </div>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 mb-4"
            >
              <Icon className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>

          <div className="glass-card-hover relative glass-card rounded-2xl p-8 border border-white/10">
            <div className="card-spotlight" />
            <div className="relative z-10">{children}</div>
          </div>

          {footer && (
            <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
