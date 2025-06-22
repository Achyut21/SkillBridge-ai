"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts"
import { 
  Target, 
  TrendingUp, 
  Award, 
  Zap,
  Eye,
  Settings,
  Download,
  Share,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronRight,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { NeonBorder } from "@/components/custom/neon-border"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  UserProgress, 
  Skill, 
  SkillLevel 
} from "@/lib/types"

interface SkillRadarProps {
  userProgress: UserProgress[]
  skills: Skill[]
  onSkillClick?: (skill: Skill) => void
  onTargetUpdate?: (skillId: string, newTarget: SkillLevel) => void
  variant?: "comprehensive" | "focused" | "comparison"
  title?: string
}

interface RadarDataPoint {
  skill: string
  current: number
  target: number
  market: number
  category: string
  fullName: string
  trend: "up" | "down" | "stable"
}

const skillLevelToNumber = {
  [SkillLevel.BEGINNER]: 1,
  [SkillLevel.INTERMEDIATE]: 2,
  [SkillLevel.ADVANCED]: 3,
  [SkillLevel.EXPERT]: 4
}

const numberToSkillLevel = {
  1: SkillLevel.BEGINNER,
  2: SkillLevel.INTERMEDIATE,
  3: SkillLevel.ADVANCED,
  4: SkillLevel.EXPERT
}

const skillLevelLabels = {
  [SkillLevel.BEGINNER]: "Beginner",
  [SkillLevel.INTERMEDIATE]: "Intermediate",
  [SkillLevel.ADVANCED]: "Advanced",
  [SkillLevel.EXPERT]: "Expert"
}

const categoryColors = {
  "Frontend": "#3B82F6", // Blue
  "Backend": "#10B981", // Green
  "DevOps": "#F59E0B", // Orange
  "Data": "#8B5CF6", // Purple
  "Mobile": "#EF4444", // Red
  "AI/ML": "#EC4899", // Pink
  "Design": "#06B6D4", // Cyan
  "Other": "#6B7280" // Gray
}

export function SkillRadar({
  userProgress,
  skills,
  onSkillClick,
  onTargetUpdate,
  variant = "comprehensive",
  title = "Skill Competency Radar"
}: SkillRadarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [radarSize, setRadarSize] = useState(80)
  const [showMarketData, setShowMarketData] = useState(true)
  const [showTargets, setShowTargets] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [showLegend, setShowLegend] = useState(true)

  // Prepare radar chart data
  const radarData: RadarDataPoint[] = useMemo(() => {
    const progressMap = new Map(userProgress.map(p => [p.skillId, p]))
    
    return skills
      .filter(skill => selectedCategory === "all" || skill.category === selectedCategory)
      .slice(0, variant === "focused" ? 6 : variant === "comparison" ? 8 : 12)
      .map(skill => {
        const progress = progressMap.get(skill.id)
        const currentLevel = progress?.currentLevel || SkillLevel.BEGINNER
        const targetLevel = progress?.targetLevel || SkillLevel.INTERMEDIATE
        
        // Mock market demand level (would come from real market data)
        const marketLevel = Math.min(4, Math.max(1, Math.round(skill.marketDemand / 25)))
        
        // Calculate trend based on recent progress
        let trend: "up" | "down" | "stable" = "stable"
        if (progress && progress.progressPercentage > 75) trend = "up"
        else if (progress && progress.progressPercentage < 25) trend = "down"

        return {
          skill: skill.name.length > 12 ? skill.name.substring(0, 12) + "..." : skill.name,
          current: skillLevelToNumber[currentLevel],
          target: skillLevelToNumber[targetLevel],
          market: marketLevel,
          category: skill.category,
          fullName: skill.name,
          trend
        }
      })
  }, [skills, userProgress, selectedCategory, variant])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(skills.map(s => s.category)))
    return ["all", ...cats]
  }, [skills])

  // Calculate radar statistics
  const radarStats = useMemo(() => {
    const totalCurrent = radarData.reduce((sum, item) => sum + item.current, 0)
    const totalTarget = radarData.reduce((sum, item) => sum + item.target, 0)
    const totalMarket = radarData.reduce((sum, item) => sum + item.market, 0)
    
    const averageCurrent = radarData.length > 0 ? totalCurrent / radarData.length : 0
    const averageTarget = radarData.length > 0 ? totalTarget / radarData.length : 0
    const averageMarket = radarData.length > 0 ? totalMarket / radarData.length : 0
    
    const gapToTarget = averageTarget - averageCurrent
    const gapToMarket = averageMarket - averageCurrent
    
    return {
      averageCurrent,
      averageTarget,
      averageMarket,
      gapToTarget,
      gapToMarket,
      totalSkills: radarData.length,
      skillsAboveMarket: radarData.filter(d => d.current >= d.market).length
    }
  }, [radarData])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <GlassmorphismCard variant="heavy" className="p-3 border shadow-lg">
          <div className="text-sm">
            <p className="font-semibold mb-2">{data.fullName}</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Current:</span>
                <Badge variant="outline">{skillLevelLabels[numberToSkillLevel[data.current] as SkillLevel]}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Target:</span>
                <Badge variant="secondary">{skillLevelLabels[numberToSkillLevel[data.target] as SkillLevel]}</Badge>
              </div>
              {showMarketData && (
                <div className="flex justify-between">
                  <span>Market:</span>
                  <Badge className="bg-purple-100 text-purple-700">
                    {skillLevelLabels[numberToSkillLevel[data.market] as SkillLevel]}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </GlassmorphismCard>
      )
    }
    return null
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <ArrowUp className="h-3 w-3 text-green-500" />
      case "down": return <ArrowDown className="h-3 w-3 text-red-500" />
      default: return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visualize your skill competencies and gaps
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GradientButton variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </GradientButton>
          <GradientButton variant="outline" size="sm" className="gap-2">
            <Share className="h-4 w-4" />
            Share
          </GradientButton>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Category:</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Size:</label>
            <div className="w-24">
              <Slider
                value={[radarSize]}
                onValueChange={([value]) => setRadarSize(value)}
                min={60}
                max={100}
                step={5}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GradientButton
            variant={showMarketData ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMarketData(!showMarketData)}
          >
            Market Data
          </GradientButton>
          <GradientButton
            variant={showTargets ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTargets(!showTargets)}
          >
            Targets
          </GradientButton>
          <GradientButton
            variant={showLegend ? "default" : "outline"}
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
          >
            Legend
          </GradientButton>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-2">
          <GlassmorphismCard variant="default" className="p-6">
            <div style={{ width: "100%", height: `${radarSize * 5}px` }}>
              <ResponsiveContainer>
                <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <PolarGrid 
                    stroke="#e5e7eb" 
                    strokeDasharray="3 3"
                    className="dark:stroke-gray-600"
                  />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    className="dark:fill-gray-400"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 4]} 
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickCount={5}
                    className="dark:fill-gray-500"
                  />
                  
                  {/* Current Level */}
                  <Radar
                    name="Current Level"
                    dataKey="current"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                  
                  {/* Target Level */}
                  {showTargets && (
                    <Radar
                      name="Target Level"
                      dataKey="target"
                      stroke="#10B981"
                      fill="none"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                    />
                  )}
                  
                  {/* Market Demand */}
                  {showMarketData && (
                    <Radar
                      name="Market Demand"
                      dataKey="market"
                      stroke="#8B5CF6"
                      fill="none"
                      strokeWidth={2}
                      strokeDasharray="2 4"
                      dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 3 }}
                    />
                  )}
                  
                  <Tooltip content={<CustomTooltip />} />
                  
                  {showLegend && (
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      wrapperStyle={{ fontSize: "12px", color: "#6b7280" }}
                    />
                  )}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Stats and Controls */}
        <div className="space-y-4">
          {/* Radar Statistics */}
          <GlassmorphismCard variant="subtle" className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-brand-500" />
              Radar Stats
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Current</span>
                <Badge variant="outline">
                  {skillLevelLabels[numberToSkillLevel[Math.round(radarStats.averageCurrent)] as SkillLevel]}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Target</span>
                <Badge variant="secondary">
                  {skillLevelLabels[numberToSkillLevel[Math.round(radarStats.averageTarget)] as SkillLevel]}
                </Badge>
              </div>
              
              {showMarketData && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Market Average</span>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30">
                    {skillLevelLabels[numberToSkillLevel[Math.round(radarStats.averageMarket)] as SkillLevel]}
                  </Badge>
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Skills Tracked</span>
                  <Badge>{radarStats.totalSkills}</Badge>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Above Market</span>
                  <Badge 
                    className={radarStats.skillsAboveMarket > radarStats.totalSkills / 2 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"}
                  >
                    {radarStats.skillsAboveMarket}/{radarStats.totalSkills}
                  </Badge>
                </div>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Gap Analysis */}
          <GlassmorphismCard variant="subtle" className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-500" />
              Gap Analysis
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Gap to Target</span>
                  <span className={`text-sm font-medium ${
                    radarStats.gapToTarget > 0 ? "text-orange-600" : "text-green-600"
                  }`}>
                    {radarStats.gapToTarget > 0 ? "+" : ""}{radarStats.gapToTarget.toFixed(1)}
                  </span>
                </div>
                <Progress 
                  value={Math.max(0, (4 - Math.abs(radarStats.gapToTarget)) / 4 * 100)} 
                  className="h-2"
                />
              </div>
              
              {showMarketData && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Gap to Market</span>
                    <span className={`text-sm font-medium ${
                      radarStats.gapToMarket > 0 ? "text-red-600" : "text-green-600"
                    }`}>
                      {radarStats.gapToMarket > 0 ? "+" : ""}{radarStats.gapToMarket.toFixed(1)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.max(0, (4 - Math.abs(radarStats.gapToMarket)) / 4 * 100)} 
                    className="h-2"
                  />
                </div>
              )}
            </div>
          </GlassmorphismCard>

          {/* Skill Details */}
          <GlassmorphismCard variant="subtle" className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-brand-500" />
              Skill Details
            </h3>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {radarData.map((skill, index) => (
                <motion.div
                  key={skill.fullName}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSkill === skill.fullName
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-brand-300"
                  }`}
                  onClick={() => {
                    setSelectedSkill(selectedSkill === skill.fullName ? null : skill.fullName)
                    const fullSkill = skills.find(s => s.name === skill.fullName)
                    if (fullSkill && onSkillClick) onSkillClick(fullSkill)
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{skill.fullName}</span>
                      {getTrendIcon(skill.trend)}
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: categoryColors[skill.category] || "#6B7280" }}
                    >
                      {skill.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Current: {skillLevelLabels[numberToSkillLevel[skill.current] as SkillLevel]}</span>
                    <span>Target: {skillLevelLabels[numberToSkillLevel[skill.target] as SkillLevel]}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassmorphismCard>

          {/* Actions */}
          <div className="space-y-2">
            <GradientButton variant="primary" size="md" className="w-full flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </GradientButton>
            
            <GradientButton variant="outline" size="md" className="w-full flex items-center justify-center gap-2">
              <Settings className="h-4 w-4" />
              Customize View
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  )
}