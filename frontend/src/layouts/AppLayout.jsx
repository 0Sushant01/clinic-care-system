import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'

export const AppLayout = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main App Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Dynamic Page Content Outlet */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 bg-slate-950/40">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
