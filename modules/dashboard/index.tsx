'use client'
import React from 'react'
import {Header} from './components/header'
import UserCoursesTable from './components/table'

export function DashboardPage() {
  return (
    <div className="w-full flex flex-col gap-8 min-h-screen pb-16 pt-10">
      <Header/>
      <UserCoursesTable/>
    </div>
  )
}
