import React from 'react';
import { Link } from 'react-router-dom';
import { Server, GitBranch, ExternalLink, Code2, Cpu, Layers, Zap, Target, Users } from 'lucide-react';

const team = [
  {
    name: 'Manish Yadav',
    role: 'Lead Developer & System Architect',
    bio: 'Passionate about OS-level concurrency, systems programming, and building high-performance applications.',
    avatar: 'MY',
    gradient: 'from-blue-500 to-cyan-400',
    github: '#',
    linkedin: '#',
  },
];

const milestones = [
  { icon: <Cpu className="w-5 h-5" />, title: 'Thread Pool Core', desc: 'Priority-aware task queue with dynamic worker management.' },
  { icon: <Zap className="w-5 h-5" />, title: 'Real-Time Telemetry', desc: 'Live charts tracking active threads, queue depth, and throughput.' },
  { icon: <Layers className="w-5 h-5" />, title: 'Benchmark Engine', desc: 'Side-by-side comparison of Thread Pool vs Thread-Per-Task model.' },
  { icon: <Target className="w-5 h-5" />, title: 'OS Concepts Visualized', desc: 'Brings OS scheduling theory to an interactive, explorable dashboard.' },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-20 relative z-10 text-center">
          <div className="inline-flex p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30 mb-6 shadow-lg shadow-blue-500/10">
            <Server className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            About Thread Pool OS Simulator
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            An interactive, real-time visualization of OS-level thread pool concurrency — built as an Operating Systems project
            to bridge the gap between theory and practice.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/" id="about-go-dashboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/25">
              Go to Dashboard
            </Link>
            <Link to="/contact" id="about-contact-us"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold border border-slate-700 transition-all hover:-translate-y-0.5">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-3">Our Mission</div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Making OS Concepts Tangible</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Operating System concepts like thread pools, scheduling, and concurrency are often abstract and hard to grasp
              through textbooks alone. This project transforms those concepts into a live, interactive experience.
            </p>
            <p className="text-slate-400 leading-relaxed">
              By submitting tasks, resizing the worker pool, and watching metrics update in real time, users gain intuitive
              understanding of how modern systems achieve high-performance parallelism.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {milestones.map((m, i) => (
              <div key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/40 hover:bg-slate-800/60 transition-all duration-300 group">
                <div className="p-2 bg-blue-500/15 rounded-xl w-fit mb-3 text-blue-400 group-hover:bg-blue-500/25 transition-colors">
                  {m.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{m.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-2">Technology Stack</div>
            <h2 className="text-3xl font-bold text-white">Built With Modern Tools</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'React', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-500/20' },
              { name: 'Node.js', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-500/20' },
              { name: 'Express', color: 'text-slate-300', bg: 'bg-slate-700/40 border-slate-600/20' },
              { name: 'Recharts', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-500/20' },
              { name: 'Tailwind', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-500/20' },
              { name: 'Vite', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-500/20' },
            ].map((tech) => (
              <div key={tech.name}
                className={`${tech.bg} border rounded-2xl py-4 flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform duration-200`}>
                <Code2 className={`w-6 h-6 ${tech.color}`} />
                <span className={`text-sm font-semibold ${tech.color}`}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 text-purple-400 text-sm font-bold uppercase tracking-widest mb-2">
              <Users className="w-4 h-4" /> The Team
            </div>
            <h2 className="text-3xl font-bold text-white">Meet the Developer</h2>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            {team.map((member) => (
              <div key={member.name}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center hover:border-slate-600 transition-all hover:-translate-y-1 duration-300 shadow-xl">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-2xl font-black text-white mx-auto mb-4 shadow-lg`}>
                  {member.avatar}
                </div>
                <h3 className="text-white font-bold text-xl">{member.name}</h3>
                <p className="text-blue-400 text-sm font-medium mt-1 mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <a href={member.github} id={`github-${member.name.replace(' ', '-')}`}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-all">
                    <GitBranch className="w-4 h-4" />
                  </a>
                  <a href={member.linkedin} id={`linkedin-${member.name.replace(' ', '-')}`}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-400 hover:text-blue-400 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 text-center py-8 text-slate-600 text-sm">
        © {new Date().getFullYear()} Thread Pool OS Simulator · Built for OS Course Project
      </footer>
    </div>
  );
}
