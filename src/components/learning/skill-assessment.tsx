"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Briefcase, 
  Target, 
  Clock, 
  Brain, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Zap,
  BookOpen,
  Headphones,
  Eye,
  Hand
} from "lucide-react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { NeonBorder } from "@/components/custom/neon-border"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  SkillAssessmentForm, 
  SkillLevel, 
  LearningStyle,
  Skill 
} from "@/lib/types"

interface SkillAssessmentProps {
  onComplete: (data: SkillAssessmentForm) => void
  availableSkills?: Skill[]
}

const steps = [
  { id: 1, title: "Current Role", icon: Briefcase },
  { id: 2, title: "Target Role", icon: Target },
  { id: 3, title: "Experience", icon: Clock },
  { id: 4, title: "Current Skills", icon: Brain },
  { id: 5, title: "Learning Goals", icon: Sparkles },
  { id: 6, title: "Time Commitment", icon: Zap },
  { id: 7, title: "Learning Style", icon: BookOpen }
]

const learningStyleIcons = {
  VISUAL: Eye,
  AUDITORY: Headphones,
  READING: BookOpen,
  KINESTHETIC: Hand
}

const learningStyleDescriptions = {
  VISUAL: "I learn best through diagrams, videos, and visual demonstrations",
  AUDITORY: "I prefer listening to explanations, podcasts, and discussions",
  READING: "I excel with written materials, documentation, and note-taking",
  KINESTHETIC: "I need hands-on practice and interactive exercises"
}

export function SkillAssessment({ onComplete, availableSkills = [] }: SkillAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<SkillAssessmentForm>>({
    currentSkills: [],
    learningGoals: [],
    timeCommitment: 10,
    yearsOfExperience: 0
  })

  const progress = (currentStep / steps.length) * 100

  const updateFormData = (field: keyof SkillAssessmentForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete(formData as SkillAssessmentForm)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                What&apos;s your current role?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                This helps us understand your starting point
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentRole">Current Job Title</Label>
              <Input
                id="currentRole"
                placeholder="e.g., Junior Developer, Marketing Manager"
                value={formData.currentRole || ""}
                onChange={(e) => updateFormData("currentRole", e.target.value)}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur"
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Where do you want to be?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your dream role guides your learning journey
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Job Title</Label>
              <Input
                id="targetRole"
                placeholder="e.g., Senior Full Stack Developer, VP of Marketing"
                value={formData.targetRole || ""}
                onChange={(e) => updateFormData("targetRole", e.target.value)}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Years of Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                How long have you been in your field?
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-600">
                  {formData.yearsOfExperience} years
                </div>
              </div>
              <Slider
                value={[formData.yearsOfExperience || 0]}
                onValueChange={([value]) => updateFormData("yearsOfExperience", value)}
                max={30}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Fresh Graduate</span>
                <span>30+ Years</span>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Current Skills
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Select your skills and rate your proficiency
              </p>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {availableSkills.slice(0, 10).map((skill) => (
                <GlassmorphismCard key={skill.id} variant="subtle" className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{skill.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {skill.category}
                      </p>
                    </div>
                    <RadioGroup
                      value={
                        formData.currentSkills?.find(s => s.skillId === skill.id)?.level || ""
                      }
                      onValueChange={(value) => {
                        const newSkills = [...(formData.currentSkills || [])]
                        const existingIndex = newSkills.findIndex(s => s.skillId === skill.id)
                        
                        if (existingIndex >= 0) {
                          newSkills[existingIndex].level = value as SkillLevel
                        } else {
                          newSkills.push({ skillId: skill.id, level: value as SkillLevel })
                        }
                        
                        updateFormData("currentSkills", newSkills)
                      }}
                      className="flex flex-row gap-2"
                    >
                      {Object.values(SkillLevel).map((level) => (
                        <div key={level} className="flex items-center">
                          <RadioGroupItem value={level} id={`${skill.id}-${level}`} />
                          <Label htmlFor={`${skill.id}-${level}`} className="ml-1 text-xs">
                            {level.charAt(0)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </GlassmorphismCard>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Learning Goals
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                What do you want to achieve?
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Your Goals (one per line)</Label>
              <Textarea
                id="goals"
                placeholder="e.g., 
Master React and Next.js
Get AWS certified
Lead a development team
Build a successful startup"
                value={formData.learningGoals?.join("\n") || ""}
                onChange={(e) => 
                  updateFormData("learningGoals", e.target.value.split("\n").filter(g => g.trim()))
                }
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur min-h-[150px]"
              />
            </div>
            {formData.learningGoals && formData.learningGoals.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.learningGoals.map((goal, index) => (
                  <Badge key={index} variant="secondary" className="bg-brand-100 text-brand-700">
                    {goal}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Time Commitment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                How many hours per week can you dedicate to learning?
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-brand-600">
                  {formData.timeCommitment}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  hours per week
                </div>
              </div>
              <Slider
                value={[formData.timeCommitment || 10]}
                onValueChange={([value]) => updateFormData("timeCommitment", value)}
                min={1}
                max={40}
                step={1}
                className="w-full"
              />
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[5, 10, 20].map((hours) => (
                  <GradientButton
                    key={hours}
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData("timeCommitment", hours)}
                    className={formData.timeCommitment === hours ? "border-brand-500" : ""}
                  >
                    {hours} hrs/week
                  </GradientButton>
                ))}
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Learning Style
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                How do you learn best?
              </p>
            </div>
            <RadioGroup
              value={formData.preferredLearningStyle || ""}
              onValueChange={(value) => updateFormData("preferredLearningStyle", value as LearningStyle)}
              className="space-y-3"
            >
              {Object.entries(LearningStyle).map(([key, value]) => {
                const Icon = learningStyleIcons[value]
                const isSelected = formData.preferredLearningStyle === value
                
                return (
                  <motion.div
                    key={value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NeonBorder
                      color={isSelected ? "purple" : "blue"}
                      className="relative overflow-hidden"
                    >
                      <RadioGroupItem
                        value={value}
                        id={value}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={value}
                        className="flex items-start gap-4 p-4 cursor-pointer"
                      >
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${
                          isSelected 
                            ? "from-brand-500 to-purple-500" 
                            : "from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
                        }`}>
                          <Icon className={`h-6 w-6 ${isSelected ? "text-white" : "text-gray-600 dark:text-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isSelected ? "text-brand-600" : ""}`}>
                            {key.charAt(0) + key.slice(1).toLowerCase()}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {learningStyleDescriptions[value]}
                          </p>
                        </div>
                      </Label>
                    </NeonBorder>
                  </motion.div>
                )
              })}
            </RadioGroup>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: isActive ? 1.1 : isCompleted ? 1 : 0.8,
                  }}
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full
                    ${isActive 
                      ? "bg-gradient-to-br from-brand-500 to-purple-500 shadow-lg shadow-brand-500/50" 
                      : isCompleted 
                        ? "bg-brand-500" 
                        : "bg-gray-200 dark:bg-gray-700"
                    }
                  `}
                >
                  <Icon className={`h-6 w-6 ${isActive || isCompleted ? "text-white" : "text-gray-400"}`} />
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-brand-500/20"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                  }`} />
                )}
              </div>
            )
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <GlassmorphismCard variant="default" className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <GradientButton
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </GradientButton>

          <GradientButton
            onClick={handleNext}
            size="lg"
            color="purple"
            className="gap-2"
          >
            {currentStep === steps.length ? "Complete Assessment" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </GradientButton>
        </div>
      </GlassmorphismCard>
    </div>
  )
}