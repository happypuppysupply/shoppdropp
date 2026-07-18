'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Folder } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">Manage your dropshipping projects</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <Card className="bg-[#111118] border-white/10">
        <CardContent className="py-12 text-center">
          <Folder className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No projects yet. Create your first project to get started.</p>
        </CardContent>
      </Card>
    </div>
  )
}
