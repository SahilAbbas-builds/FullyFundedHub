import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';

const FAQ_CONTEXT = `FAQ:
Q: Is FullyFundedHub free to use? A: Yes, FullyFundedHub is completely free. You can browse all listings, create an account, and save opportunities without paying.
Q: How do you verify listings? A: Every listing is manually checked by our team before publishing — we verify application links, deadlines, funding amounts, and eligibility.
Q: Can I submit an opportunity? A: Yes, you can submit an opportunity through the Contact page by selecting "Submit an opportunity."
Q: How often are new opportunities added? A: We add new opportunities regularly, typically weekly. Subscribe to our newsletter to stay updated.
Q: Do you guarantee I'll get accepted? A: No. We provide verified information only, not application outcomes. Acceptance decisions are made by the organizations, not us.`;

const SYSTEM_INSTRUCTIONS = `You are the FullyFundedHub assistant. You help students find scholarships and internships and answer questions about the site.

CRITICAL RULES:
1. You may ONLY recommend opportunities from the "AVAILABLE OPPORTUNITIES" list provided below. Never invent, fabricate, or describe scholarships or internships that are not in that list.
2. If no opportunities in the list match the user's question, say: "I don't have that information right now. Please check our Opportunities page or contact us — we're happy to help!" and do NOT make up any listings.
3. When you recommend an opportunity, mention its title, organization, country, and deadline. Format each match as a short bullet.
4. Answer FAQ questions using the FAQ context provided. If a question is outside the scope of the site or the available data, say you don't have that information and suggest checking the Opportunities page or contacting us.
5. Keep answers concise and friendly. 2-5 sentences for FAQ questions; list matched opportunities as short bullets for search questions.
6. Do not mention that you were given a list — just answer naturally using the data.`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your FullyFundedHub guide. Ask me about scholarships or internships — like \"scholarships for Masters in Germany\" or \"internships in Africa\" — and I'll search our verified listings for you." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Load published opportunities once when widget is first opened
  useEffect(() => {
    if (open && !dataLoaded) {
      base44.entities.Opportunity.filter({ status: 'published' }, '-created_date', 100)
        .then((results) => {
          setOpportunities(results);
          setDataLoaded(true);
        })
        .catch(() => setDataLoaded(true));
    }
  }, [open, dataLoaded]);

  const buildContext = () => {
    if (opportunities.length === 0) {
      return 'AVAILABLE OPPORTUNITIES: (none currently published)';
    }
    const lines = opportunities.map((o) =>
      `- Title: ${o.title} | Organization: ${o.organization || 'N/A'} | Country: ${o.country || 'N/A'} | Type: ${o.opportunity_type} | Degree: ${o.degree_level || 'N/A'} | Field: ${o.field_of_study || 'N/A'} | Funding: ${o.funding_type} ${o.funding_amount || ''} | Deadline: ${o.deadline || 'N/A'} | Eligibility: ${(o.eligibility_criteria || []).join('; ')}`
    );
    return `AVAILABLE OPPORTUNITIES:\n${lines.join('\n')}`;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const prompt = `${SYSTEM_INSTRUCTIONS}\n\n${FAQ_CONTEXT}\n\n${buildContext()}\n\nUser question: ${text}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            answer: { type: 'string' },
            matched_opportunity_ids: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['answer']
        }
      });

      const answer = response.answer || "I don't have that information right now. Please check our Opportunities page or contact us — we're happy to help!";
      const matchedIds = response.matched_opportunity_ids || [];
      const matched = opportunities.filter((o) => matchedIds.includes(o.id));

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: answer, matchedOpps: matched }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "I'm having trouble connecting right now. Please try again in a moment, or browse our Opportunities page directly." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl shadow-black/50 hover:bg-primary/90 transition-all gold-glow animate-fade-in"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 max-h-[600px] flex flex-col rounded-2xl glass-card overflow-hidden shadow-2xl shadow-black/50 animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-card/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">FullyFundedHub Guide</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" style={{ minHeight: '300px', maxHeight: '400px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'glass-card'} rounded-2xl px-4 py-2.5`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  {msg.matchedOpps && msg.matchedOpps.length > 0 && (
                    <div className="mt-3 space-y-1.5 pt-2 border-t border-white/10">
                      {msg.matchedOpps.map((opp) => (
                        <Link
                          key={opp.id}
                          to={`/opportunities/${opp.id}`}
                          onClick={() => setOpen(false)}
                          className="block text-xs text-primary hover:underline"
                        >
                          → {opp.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Searching listings…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-card/50">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about scholarships, internships…"
                className="flex-1 bg-background/60 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 transition-colors"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40 flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}