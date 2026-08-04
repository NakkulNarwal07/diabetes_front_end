import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#111827_0%,_#030712_55%,_#000000_100%)] px-4 py-10">
      <form className="w-full max-w-lg rounded-3xl border border-white/10 bg-neutral-900/90 shadow-[0_0_80px_rgba(0,0,0,0.45)] backdrop-blur-xl p-8 md:p-10 space-y-5">
                <h1 className="text-2xl font-black text-teal-300 text-center mb-2">
          Code errors and expectations test page
        </h1>

        <div>
          <p className="mb-1 text-sm font-medium text-white/75">Code:</p>
          <textarea
            name="code"
            rows={10}
            cols={50}
            className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35 font-mono text-sm resize-y"
          />
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-white/75">Expectations file:</p>
          <textarea
            name="expectations"
            rows={10}
            cols={50}
            className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35 font-mono text-sm resize-y"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-white text-neutral-950 py-3 font-bold transition hover:scale-[1.01] hover:bg-teal-100"
        >
          Submit
        </button>
      </form>
    </div>
  );
}