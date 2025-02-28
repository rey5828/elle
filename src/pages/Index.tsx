import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterSection from '@/components/FilterSection';
import QuestionCard from '@/components/QuestionCard';
import { useLanguage } from '@/contexts/LanguageContext';
import zhQuestions from '../data/questions-zh.json';
import enQuestions from '../data/questions-en.json';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";

const translations = {
  zh: {
    title: "生态环境大模型测试集 - Environmental LLm Evaluation - ELLE",
    searchPlaceholder: "搜索问题内容...",
    filters: "筛选",
    difficultyFilter: "难度筛选",
    typeFilter: "类型筛选",
    domainFilter: "领域筛选",
    totalQuestions: "{count} 个问题",
    question: "问题",
    difficulty: "难度",
    type: "类型",
    domain: "领域"
  },
  en: {
    title: "Environmental LLm Evaluation - ELLE",
    searchPlaceholder: "Search question content...",
    filters: "Filters",
    difficultyFilter: "Difficulty Filter",
    typeFilter: "Type Filter",
    domainFilter: "Domain Filter",
    totalQuestions: "{count} questions",
    question: "Question",
    difficulty: "Difficulty",
    type: "Type",
    domain: "Domain"
  }
};

const Index = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const questions = language === 'zh' ? zhQuestions : enQuestions;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  // 动态获取所有唯一的难度、类型和领域值
  const difficulties = useMemo(() => [...new Set(questions.map(q => q.Difficulty))], [questions]);
  const types = useMemo(() => {
    const allTypes = questions.flatMap(q => Array.isArray(q.Type) ? q.Type : [q.Type]);
    return [...new Set(allTypes)];
  }, [questions]);
  const domains = useMemo(() => {
    const allDomains = questions.flatMap(q => Array.isArray(q.Domain) ? q.Domain : [q.Domain]);
    return [...new Set(allDomains)];
  }, [questions]);

  // 过滤问题
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      const matchesSearch = searchQuery.trim() === '' ||
        question.Question.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty = selectedDifficulties.length === 0 ||
        selectedDifficulties.includes(question.Difficulty);

      const matchesType = selectedTypes.length === 0 ||
        (Array.isArray(question.Type) ?
          question.Type.some(t => selectedTypes.includes(t)) :
          selectedTypes.includes(question.Type));

      const matchesDomain = selectedDomains.length === 0 ||
        (Array.isArray(question.Domain) ?
          question.Domain.some(d => selectedDomains.includes(d)) :
          selectedDomains.includes(question.Domain));

      return matchesSearch && matchesDifficulty && matchesType && matchesDomain;
    });
  }, [searchQuery, selectedDifficulties, selectedTypes, selectedDomains, questions]);

  const handleDifficultyToggle = (difficulty: string) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {t.title}
            </h1>
            <Tooltip>
              <TooltipTrigger>
                <ExternalLink className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p>
                  <a
                    href="https://arxiv.org/abs/2501.06277"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    Guo, J., Li, N. and Xu, M. (2025). Environmental Large Language Model Evaluation (ELLE) dataset: A Benchmark for Evaluating Generative AI applications in Eco-environment Domain. arXiv.
                  </a>
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Button
            onClick={toggleLanguage}
            variant="outline"
            className="px-4 py-2 rounded-lg"
          >
            {language === 'zh' ? 'EN' : '中文'}
          </Button>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
          <Input
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-6"
          />

          <div className="ml-auto flex justify-end">
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-gray-700">{t.filters}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={showFilters}
                  onChange={() => setShowFilters(!showFilters)}
                />
                <div className="block w-10 h-6 bg-gray-300 rounded-full"></div>
                <div
                  className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition ${showFilters ? "translate-x-full bg-blue-500" : "bg-white"}`}
                ></div>
              </div>
            </label>
          </div>

          {showFilters && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1 space-y-6">
                <FilterSection
                  title={t.difficultyFilter}
                  options={difficulties}
                  selected={selectedDifficulties}
                  onToggle={handleDifficultyToggle}
                />
                <FilterSection
                  title={t.typeFilter}
                  options={types}
                  selected={selectedTypes}
                  onToggle={handleTypeToggle}
                />
              </div>
              <div className="md:col-span-2">
                <FilterSection
                  title={t.domainFilter}
                  options={domains}
                  selected={selectedDomains}
                  onToggle={handleDomainToggle}
                />
              </div>
            </div>
          )}
        </div>

        {/* 已选筛选条件展示 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedDifficulties.map(difficulty => (
            <Badge
              key={difficulty}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleDifficultyToggle(difficulty)}
            >
              {t.difficulty}: {difficulty} ×
            </Badge>
          ))}
          {selectedTypes.map(type => (
            <Badge
              key={type}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleTypeToggle(type)}
            >
              {t.type}: {type} ×
            </Badge>
          ))}
          {selectedDomains.map(domain => (
            <Badge
              key={domain}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleDomainToggle(domain)}
            >
              {t.domain}: {domain} ×
            </Badge>
          ))}
        </div>

        {/* 结果计数 */}
        <p className="text-gray-600 mb-4">
          {t.totalQuestions.replace('{count}', filteredQuestions.length.toString())}
        </p>

        {/* 问题列表 */}
        <div className="grid gap-4">
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.Number}
              {...question}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;