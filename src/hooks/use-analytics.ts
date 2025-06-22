import { useState, useEffect, useCallback } from 'react';

interface ProgressAnalyticsData {
  overview: {
    totalPaths: number;
    completedPaths: number;
    completionRate: number;
    totalHours: number;
    completedMilestones: number;
    averageProgress: number;
    learningVelocity: number;
  };
  skillMetrics: Array<{
    skillId: string;
    skillName: string;
    proficiency: number;
    hoursInvested: number;
  }>;
  timeByCategory: {
    learning: number;
    practice: number;
    assessment: number;
  };
  recentActivity: Array<{
    date: string;
    timeSpent: number;
    progressMade: number;
  }>;
}

export function useProgressAnalytics() {
  const [data, setData] = useState<ProgressAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgressAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/analytics/progress');
      if (!response.ok) {
        throw new Error('Failed to fetch progress analytics');
      }
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgressAnalytics();
  }, [fetchProgressAnalytics]);

  const refresh = () => {
    fetchProgressAnalytics();
  };

  return { data, loading, error, refresh };
}

interface MarketInsightsData {
  insights: {
    averageSalary: number;
    salaryChange: number;
    jobOpenings: number;
    openingsChange: number;
    demandIndex: number;
    demandChange: number;
    candidatePool: number;
    poolChange: number;
  };
  trendData: Array<{
    month: string;
    demand: number;
    supply: number;
    salary: number;
    growth: number;
  }>;
  skillMarketData: Array<{
    skillId: string;
    skillName: string;
    marketData: {
      avgSalary: number;
      demand: number;
      growth: number;
      openings: number;
    };
  }>;
  salaryRanges: Array<{
    role: string;
    min: number;
    median: number;
    max: number;
    location: string;
    experience: string;
  }>;
}

export function useMarketInsights() {
  const [data, setData] = useState<MarketInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/analytics/market');
      if (!response.ok) {
        throw new Error('Failed to fetch market insights');
      }
      
      const insightsData = await response.json();
      setData(insightsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketInsights();
  }, [fetchMarketInsights]);

  const refresh = () => {
    fetchMarketInsights();
  };

  return { data, loading, error, refresh };
}

interface CompetitiveAnalysisData {
  skillComparisons: Array<{
    skill: string;
    yourLevel: number;
    marketAverage: number;
    topPerformers: number;
    demandScore: number;
    gap: number;
  }>;
  competitorData: Array<{
    skillLevel: number;
    marketValue: number;
    experience: number;
  }>;
  rankings: Array<{
    category: string;
    position: number;
    total: number;
    percentile: number;
    trend: string;
  }>;
  recommendations: Array<{
    type: string;
    icon: string;
    message: string;
  }>;
  summary: {
    averageProficiency: number;
    strongestSkill: {
      skill: string;
      yourLevel: number;
    };
    biggestGap: {
      skill: string;
      gap: number;
    };
    marketPosition: number;
    totalSkills: number;
  };
}

export function useCompetitiveAnalysis() {
  const [data, setData] = useState<CompetitiveAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitiveAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/analytics/competitive');
      if (!response.ok) {
        throw new Error('Failed to fetch competitive analysis');
      }
      
      const analysisData = await response.json();
      setData(analysisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompetitiveAnalysis();
  }, [fetchCompetitiveAnalysis]);

  const refresh = () => {
    fetchCompetitiveAnalysis();
  };

  return { data, loading, error, refresh };
}