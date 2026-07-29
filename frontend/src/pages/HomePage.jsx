/**
 * Home page — landing page for the Clinic Care System.
 * This is a placeholder that confirms the frontend is working.
 */
function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        {/* Logo / Icon */}
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          Clinic Care System
        </h1>
        <p className="text-xl text-indigo-200/80 mb-8">
          Modern clinic management — built for therapists, receptionists, and administrators.
        </p>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Frontend Running
        </div>

        {/* Tech Stack */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {['React', 'Vite', 'Tailwind CSS', 'React Router', 'Axios'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-indigo-200/70 text-sm backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
