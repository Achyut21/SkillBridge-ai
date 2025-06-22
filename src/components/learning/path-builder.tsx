"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from "@hello-pangea/dnd"
import { 
  Plus, 
  GripVertical, 
  X, 
  Target, 
  Clock, 
  TrendingUp,
  BookOpen,
  Video,
  FileText,
  Code,
  Zap,
  Star,
  Users,
  DollarSign,
  CheckCircle
} from "lucide-react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { NeonBorder } from "@/components/custom/neon-border"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Skill, 
  Resource, 
  ResourceType, 
  SkillLevel, 
  Difficulty,
  LearningPath 
} from "@/lib/types"

interface PathBuilderProps {
  availableSkills?: Skill[]
  onSave: (path: Partial<LearningPath>) => void
  onCancel: () => void
  initialPath?: Partial<LearningPath>
}

interface PathSkill {
  id: string
  skill: Skill
  targetLevel: SkillLevel
  order: number
  estimatedHours: number
  resources: Resource[]
}

const resourceTypeIcons = {
  [ResourceType.VIDEO]: Video,
  [ResourceType.ARTICLE]: FileText,
  [ResourceType.COURSE]: BookOpen,
  [ResourceType.BOOK]: BookOpen,
  [ResourceType.TUTORIAL]: Code,
  [ResourceType.PRACTICE]: Zap
}

const difficultyColors = {
  [Difficulty.EASY]: "from-green-500 to-emerald-500",
  [Difficulty.MEDIUM]: "from-yellow-500 to-orange-500", 
  [Difficulty.HARD]: "from-red-500 to-pink-500"
}

export function PathBuilder({ 
  availableSkills = [], 
  onSave, 
  onCancel, 
  initialPath 
}: PathBuilderProps) {
  const [pathData, setPathData] = useState({
    title: initialPath?.title || "",
    description: initialPath?.description || "",
    targetRole: initialPath?.targetRole || "",
    duration: initialPath?.duration || 12,
    difficulty: initialPath?.difficulty || Difficulty.MEDIUM
  })
  
  const [pathSkills, setPathSkills] = useState<PathSkill[]>([])
  const [selectedSkillId, setSelectedSkillId] = useState<string>("")
  const [showResourceLibrary, setShowResourceLibrary] = useState(false)
  const [currentSkillIndex, setCurrentSkillIndex] = useState<number | null>(null)

  // Mock resources for demo
  const mockResources: Resource[] = [
    {
      id: "1",
      title: "React Fundamentals Course",
      type: ResourceType.COURSE,
      url: "https://example.com",
      provider: "TechAcademy",
      duration: 480,
      difficulty: Difficulty.EASY,
      rating: 4.8,
      price: 49.99,
      isFree: false
    },
    {
      id: "2", 
      title: "JavaScript Algorithms Practice",
      type: ResourceType.PRACTICE,
      url: "https://example.com",
      provider: "CodeMaster",
      duration: 120,
      difficulty: Difficulty.MEDIUM,
      rating: 4.6,
      price: 0,
      isFree: true
    }
  ]

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    const newSkills = Array.from(pathSkills)
    const [reorderedSkill] = newSkills.splice(result.source.index, 1)
    newSkills.splice(result.destination.index, 0, reorderedSkill)

    // Update order numbers
    const updatedSkills = newSkills.map((skill, index) => ({
      ...skill,
      order: index
    }))

    setPathSkills(updatedSkills)
  }, [pathSkills])

  const addSkillToPath = () => {
    if (!selectedSkillId) return

    const skill = availableSkills.find(s => s.id === selectedSkillId)
    if (!skill) return

    const newPathSkill: PathSkill = {
      id: `path-skill-${Date.now()}`,
      skill,
      targetLevel: SkillLevel.INTERMEDIATE,
      order: pathSkills.length,
      estimatedHours: 40,
      resources: []
    }

    setPathSkills([...pathSkills, newPathSkill])
    setSelectedSkillId("")
  }

  const removeSkillFromPath = (skillId: string) => {
    setPathSkills(pathSkills.filter(ps => ps.id !== skillId))
  }

  const updateSkillLevel = (skillId: string, level: SkillLevel) => {
    setPathSkills(pathSkills.map(ps => 
      ps.id === skillId ? { ...ps, targetLevel: level } : ps
    ))
  }

  const updateSkillHours = (skillId: string, hours: number) => {
    setPathSkills(pathSkills.map(ps => 
      ps.id === skillId ? { ...ps, estimatedHours: hours } : ps
    ))
  }

  const addResourceToSkill = (skillId: string, resource: Resource) => {
    setPathSkills(pathSkills.map(ps => 
      ps.id === skillId 
        ? { ...ps, resources: [...ps.resources, resource] }
        : ps
    ))
  }

  const getTotalHours = () => {
    return pathSkills.reduce((total, skill) => total + skill.estimatedHours, 0)
  }

  const getTotalWeeks = () => {
    return Math.ceil(getTotalHours() / 10) // Assuming 10 hours per week
  }

  const handleSave = () => {
    const learningPathData: Partial<LearningPath> = {
      title: pathData.title,
      description: pathData.description,
      targetRole: pathData.targetRole,
      duration: getTotalWeeks(),
      difficulty: pathData.difficulty,
      skills: pathSkills.map(ps => ({
        skillId: ps.skill.id,
        skill: ps.skill,
        order: ps.order,
        targetLevel: ps.targetLevel
      })),
      resources: pathSkills.flatMap(ps => ps.resources),
      progress: 0,
      isActive: false
    }

    onSave(learningPathData)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
            Build Learning Path
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create a personalized journey to achieve your career goals
          </p>
        </div>
        <div className="flex gap-3">
          <GradientButton variant="outline" onClick={onCancel}>
            Cancel
          </GradientButton>
          <GradientButton 
            onClick={handleSave}
            disabled={!pathData.title || pathSkills.length === 0}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Save Path
          </GradientButton>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Path Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <GlassmorphismCard variant="default" className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-brand-500" />
              Path Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Path Title</Label>
                <Input
                  id="title"
                  value={pathData.title}
                  onChange={(e) => setPathData({...pathData, title: e.target.value})}
                  placeholder="e.g., Full-Stack AI Developer"
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <div>
                <Label htmlFor="targetRole">Target Role</Label>
                <Input
                  id="targetRole"
                  value={pathData.targetRole}
                  onChange={(e) => setPathData({...pathData, targetRole: e.target.value})}
                  placeholder="e.g., Senior AI Engineer"
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={pathData.description}
                  onChange={(e) => setPathData({...pathData, description: e.target.value})}
                  placeholder="Brief description of the path"
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <div>
                <Label>Difficulty Level</Label>
                <Select
                  value={pathData.difficulty}
                  onValueChange={(value) => setPathData({...pathData, difficulty: value as Difficulty})}
                >
                  <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Difficulty.EASY}>Beginner</SelectItem>
                    <SelectItem value={Difficulty.MEDIUM}>Intermediate</SelectItem>
                    <SelectItem value={Difficulty.HARD}>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Path Statistics */}
          <GlassmorphismCard variant="subtle" className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-500" />
              Path Stats
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Skills</span>
                <Badge variant="secondary">{pathSkills.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Estimated Hours</span>
                <Badge variant="secondary">{getTotalHours()}h</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Duration</span>
                <Badge variant="secondary">{getTotalWeeks()} weeks</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Difficulty</span>
                <Badge 
                  className={`bg-gradient-to-r ${difficultyColors[pathData.difficulty]} text-white`}
                >
                  {pathData.difficulty}
                </Badge>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Add Skills */}
          <GlassmorphismCard variant="subtle" className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-brand-500" />
              Add Skills
            </h3>
            
            <div className="space-y-3">
              <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills
                    .filter(skill => !pathSkills.some(ps => ps.skill.id === skill.id))
                    .map(skill => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name} ({skill.category})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              
              <GradientButton 
                onClick={addSkillToPath}
                disabled={!selectedSkillId}
                size="sm"
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </GradientButton>
            </div>
          </GlassmorphismCard>
        </div>
        {/* Skills List with Drag & Drop */}
        <div className="lg:col-span-2">
          <GlassmorphismCard variant="default" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-brand-500" />
                Learning Sequence
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag skills to reorder your learning path
              </p>
            </div>

            {pathSkills.length === 0 ? (
              <NeonBorder color="blue" className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                  No skills added yet
                </h4>
                <p className="text-gray-500 dark:text-gray-500">
                  Add skills from the sidebar to start building your learning path
                </p>
              </NeonBorder>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="skills-list">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-4 min-h-[200px] p-4 rounded-lg transition-colors ${
                        snapshot.isDraggingOver 
                          ? "bg-brand-50 dark:bg-brand-900/20 border-2 border-dashed border-brand-300" 
                          : ""
                      }`}
                    >
                      <AnimatePresence>
                        {pathSkills.map((pathSkill, index) => (
                          <Draggable 
                            key={pathSkill.id} 
                            draggableId={pathSkill.id} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`transform transition-all duration-200 ${
                                  snapshot.isDragging 
                                    ? "rotate-3 scale-105 shadow-xl shadow-brand-500/20" 
                                    : ""
                                }`}
                              >
                                <NeonBorder 
                                  color={snapshot.isDragging ? "purple" : "blue"}
                                  className="relative overflow-hidden"
                                >
                                  <div className="p-4">
                                    <div className="flex items-start gap-4">
                                      {/* Drag Handle */}
                                      <div 
                                        {...provided.dragHandleProps}
                                        className="mt-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                                      >
                                        <GripVertical className="h-5 w-5 text-gray-400" />
                                      </div>

                                      {/* Skill Info */}
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                          <div>
                                            <h4 className="text-lg font-semibold">
                                              {index + 1}. {pathSkill.skill.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                              {pathSkill.skill.category}
                                            </p>
                                          </div>
                                          <GradientButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSkillFromPath(pathSkill.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                          >
                                            <X className="h-4 w-4" />
                                          </GradientButton>
                                        </div>

                                        {/* Target Level Selection */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                          <div>
                                            <Label className="text-sm">Target Level</Label>
                                            <Select
                                              value={pathSkill.targetLevel}
                                              onValueChange={(value) => 
                                                updateSkillLevel(pathSkill.id, value as SkillLevel)
                                              }
                                            >
                                              <SelectTrigger className="h-8 text-sm bg-white/50 dark:bg-gray-800/50">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {Object.values(SkillLevel).map(level => (
                                                  <SelectItem key={level} value={level}>
                                                    {level.charAt(0) + level.slice(1).toLowerCase()}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div>
                                            <Label className="text-sm">
                                              Study Hours: {pathSkill.estimatedHours}h
                                            </Label>
                                            <Slider
                                              value={[pathSkill.estimatedHours]}
                                              onValueChange={([value]) => 
                                                updateSkillHours(pathSkill.id, value)
                                              }
                                              min={10}
                                              max={200}
                                              step={10}
                                              className="mt-2"
                                            />
                                          </div>
                                        </div>

                                        {/* Resources */}
                                        <div>
                                          <div className="flex items-center justify-between mb-2">
                                            <Label className="text-sm">Resources ({pathSkill.resources.length})</Label>
                                            <GradientButton
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                setCurrentSkillIndex(index)
                                                setShowResourceLibrary(true)
                                              }}
                                              className="text-xs gap-1"
                                            >
                                              <Plus className="h-3 w-3" />
                                              Add
                                            </GradientButton>
                                          </div>
                                          
                                          {pathSkill.resources.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                              {pathSkill.resources.map(resource => {
                                                const Icon = resourceTypeIcons[resource.type]
                                                return (
                                                  <Badge 
                                                    key={resource.id}
                                                    variant="outline" 
                                                    className="gap-1 text-xs"
                                                  >
                                                    <Icon className="h-3 w-3" />
                                                    {resource.title}
                                                    {resource.isFree ? (
                                                      <Star className="h-3 w-3 text-yellow-500" />
                                                    ) : (
                                                      <DollarSign className="h-3 w-3 text-green-500" />
                                                    )}
                                                  </Badge>
                                                )
                                              })}
                                            </div>
                                          ) : (
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                              No resources added yet
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </NeonBorder>
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </GlassmorphismCard>
        </div>
      </div>

      {/* Resource Library Modal */}
      <AnimatePresence>
        {showResourceLibrary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowResourceLibrary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassmorphismCard variant="heavy" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                    Resource Library
                  </h3>
                  <GradientButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResourceLibrary(false)}
                  >
                    <X className="h-4 w-4" />
                  </GradientButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                  {mockResources.map(resource => {
                    const Icon = resourceTypeIcons[resource.type]
                    return (
                      <NeonBorder key={resource.id} color="blue" className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                              <Icon className="h-5 w-5 text-brand-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{resource.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {resource.provider}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {resource.type.toLowerCase()}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {Math.floor((resource.duration || 0) / 60)}h {(resource.duration || 0) % 60}m
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {resource.rating}
                            </div>
                          </div>
                          <div className={`text-sm font-medium ${
                            resource.isFree ? "text-green-600" : "text-gray-600"
                          }`}>
                            {resource.isFree ? "Free" : `$${resource.price}`}
                          </div>
                        </div>

                        <GradientButton
                          size="sm"
                          onClick={() => {
                            if (currentSkillIndex !== null) {
                              addResourceToSkill(pathSkills[currentSkillIndex].id, resource)
                              setShowResourceLibrary(false)
                            }
                          }}
                          className="w-full gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add to Path
                        </GradientButton>
                      </NeonBorder>
                    )
                  })}
                </div>
              </GlassmorphismCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}