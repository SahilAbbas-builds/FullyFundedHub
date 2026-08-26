import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import OpportunityCard from '@/components/OpportunityCard';
import CustomSelect from '@/components/CustomSelect';
import SEO from '@/components/SEO';
import { Search, SlidersHorizontal, X, Inbox, Clock } from 'lucide-react';

const DEGREE_LEVELS = ['Undergraduate', 'Masters', 'PhD', 'All Levels'];
const FUNDING_TYPES = ['Full', 'Partial'];
const OPP_TYPES = ['Scholarship', 'Internship'];

export default function Opportunities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    opportunity_type: '',
    degree_level: '',
    funding_type: '',
    country: '',
    field_of_study: '',
  });
  const [sortByDeadline, setSortByDeadline] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadOpportunities = async () => {
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'published')
        .limit(200);

      query = sortByDeadline
        ? query.order('deadline', { ascending: true })
        : query.order('created_at', { ascending: false });

      const { data } = await query;
      setOpportunities(data || []);
      setLoading(false);
    };

    loadOpportunities().catch(() => setLoading(false));
  }, [sortByDeadline]);

  const countries = useMemo(() => {
    return [...new Set(opportunities.map((o) => o.country).filter(Boolean))].sort();
  }, [opportunities]);

  const fields = useMemo(() => {
    return [...new Set(opportunities.map((o) => o.field_of_study).filter(Boolean))].sort();
  }, [opportunities]);

  const { activeListings, expiredListings } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const active = [];
    const expired = [];
    opportunities.forEach((opp) => {
      if (filters.opportunity_type && opp.opportunity_type !== filters.opportunity_type) return;
      if (filters.degree_level && opp.degree_level !== filters.degree_level) return;
      if (filters.funding_type && opp.funding_type !== filters.funding_type) return;
      if (filters.country && opp.country !== filters.country) return;
      if (filters.field_of_study && opp.field_of_study !== filters.field_of_study) return;
      if (search) {
        const q = search.toLowerCase();
        const haystack = [opp.title, opp.organization, opp.country, opp.field_of_study, opp.description]
          .filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(q)) return;
      }
      if (opp.deadline && new Date(opp.deadline) < today) {
        expired.push(opp);
      } else {
        active.push(opp);
      }
    });
    return { activeListings: active, expiredListings: expired };
  }, [opportunities, filters, search]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ opportunity_type: '', degree_level: '', funding_type: '', country: '', field_of_study: '' });
    setSearch('');
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || search;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title="All Scholarships & Internships — FullyFundedHub" description="Search and filter manually verified, fully funded scholarships and internships by country, degree level, and field of study. Undergraduate to PhD, worldwide." />

      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold">All Opportunities</h1>
        <p className="text-muted-foreground mt-2">Browse verified scholarships and internships from around the world.</p>
      </div>

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keyword, country, or field…"
            className="w-full pl-11 pr-4 py-3 rounded-xl glass-card border border-white/10 outline-none text-sm focus:border-primary/40 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-card text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
        <label className="flex items-center gap-2 px-4 py-3 rounded-xl glass-card text-sm cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={sortByDeadline}
            onChange={(e) => setSortByDeadline(e.target.checked)}
            className="accent-primary"
          />
          Deadline (soonest)
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-64 flex-shrink-0`}>
          <div className="glass-card rounded-2xl p-5 sm:sticky sm:top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <FilterGroup label="Type">
              <PillSelect options={OPP_TYPES} value={filters.opportunity_type} onChange={(v) => updateFilter('opportunity_type', v)} />
            </FilterGroup>
            <FilterGroup label="Degree Level">
              <PillSelect options={DEGREE_LEVELS} value={filters.degree_level} onChange={(v) => updateFilter('degree_level', v)} />
            </FilterGroup>
            <FilterGroup label="Funding">
              <PillSelect options={FUNDING_TYPES} value={filters.funding_type} onChange={(v) => updateFilter('funding_type', v)} />
            </FilterGroup>
            <FilterGroup label="Country">
              <CustomSelect value={filters.country} onChange={(v) => updateFilter('country', v)} options={countries} placeholder="All countries" />
            </FilterGroup>
            <FilterGroup label="Field of Study">
              <CustomSelect value={filters.field_of_study} onChange={(v) => updateFilter('field_of_study', v)} options={fields} placeholder="All fields" />
            </FilterGroup>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-4">{loading ? 'Loading…' : `${activeListings.length} opportunit${activeListings.length === 1 ? 'y' : 'ies'} found`}</p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl glass-card animate-pulse" />)}
            </div>
          ) : activeListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeListings.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)}
              </div>

              {expiredListings.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-5">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <h2 className="font-heading text-xl font-bold text-muted-foreground">Expired ({expiredListings.length})</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-60">
                    {expiredListings.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)}
                  </div>
                </div>
              )}
            </>
          ) : expiredListings.length > 0 ? (
            <>
              <div className="glass-card rounded-2xl py-12 text-center mb-8">
                <Inbox className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No active opportunities match your filters.</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">Clear filters</button>
                )}
              </div>
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-heading text-xl font-bold text-muted-foreground">Expired ({expiredListings.length})</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-60">
                {expiredListings.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)}
              </div>
            </>
          ) : (
            <div className="glass-card rounded-2xl py-20 text-center">
              <Inbox className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No opportunities match your filters.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">Clear filters</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      {children}
    </div>
  );
}

function PillSelect({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onChange('')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!value ? 'bg-primary text-primary-foreground' : 'bg-background/40 text-muted-foreground hover:text-foreground border border-white/10'}`}
      >
        All
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt === value ? '' : opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${value === opt ? 'bg-primary text-primary-foreground' : 'bg-background/40 text-muted-foreground hover:text-foreground border border-white/10'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}


