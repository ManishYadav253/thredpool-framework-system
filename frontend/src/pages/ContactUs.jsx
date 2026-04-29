import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Server, Mail, GitBranch, MessageSquare, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

const contactLinks = [
  { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'manish@example.com', href: 'mailto:manish@example.com', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { icon: <GitBranch className="w-5 h-5" />, label: 'GitHub', value: 'github.com/ManishYadav253', href: 'https://github.com/ManishYadav253', color: 'text-slate-300', bg: 'bg-slate-700/40 border-slate-600/20' },
  { icon: <MessageSquare className="w-5 h-5" />, label: 'Discord', value: 'ManishY#0000', href: '#', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'India 🇮🇳', href: '#', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-16 relative z-10 text-center">
          <div className="inline-flex p-4 bg-emerald-500/15 rounded-2xl border border-emerald-500/30 mb-6 shadow-lg shadow-emerald-500/10">
            <Phone className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Have questions, feedback, or want to collaborate? We'd love to hear from you.
          </p>
          <nav className="flex justify-center gap-3 mt-6">
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Dashboard</Link>
            <span className="text-slate-700">/</span>
            <span className="text-sm text-emerald-400 font-medium">Contact</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Left — Contact Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Get in Touch</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Whether it's a bug report, a feature request, or just a question about the project —
            reach out through any of the channels below.
          </p>

          <div className="space-y-4">
            {contactLinks.map((c) => (
              <a key={c.label} href={c.href} id={`contact-${c.label.toLowerCase()}`}
                className={`flex items-center gap-4 p-4 ${c.bg} border rounded-2xl hover:scale-[1.02] transition-all duration-200 group`}>
                <div className={`${c.color} shrink-0`}>{c.icon}</div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{c.label}</div>
                  <div className={`${c.color} font-semibold text-sm mt-0.5`}>{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* FAQ Snippet */}
          <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 text-lg">Quick FAQ</h3>
            <div className="space-y-3 text-sm">
              {[
                { q: 'Is this open source?', a: 'Yes! Check the GitHub repo for the full source code.' },
                { q: 'Can I use this for my own OS project?', a: 'Absolutely — it\'s built to be a reference implementation.' },
                { q: 'Does it require a database?', a: 'No, the simulator runs entirely in-memory on Node.js.' },
              ].map((faq, i) => (
                <div key={i} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                  <p className="text-slate-300 font-medium">{faq.q}</p>
                  <p className="text-slate-500 mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Contact Form */}
        <div>
          {submitted ? (
            <div className="bg-slate-900/70 border border-emerald-500/30 rounded-3xl p-10 text-center flex flex-col items-center gap-4 h-full justify-center">
              <div className="p-4 bg-emerald-500/20 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-slate-400">Thanks for reaching out. We'll get back to you shortly.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-all"
              >
                Send Another
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 shadow-2xl shadow-black/40">
              <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm"
                  >
                    <option value="">Select a topic...</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="collab">Collaboration</option>
                    <option value="question">General Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm resize-none"
                  />
                  <p className="text-xs text-slate-600 mt-1">{form.message.length} / 500 characters</p>
                </div>

                <button
                  id="contact-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-60 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/35 hover:-translate-y-0.5"
                >
                  {loading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 text-center py-8 text-slate-600 text-sm">
        © {new Date().getFullYear()} Thread Pool OS Simulator · Built for OS Course Project
      </footer>
    </div>
  );
}
