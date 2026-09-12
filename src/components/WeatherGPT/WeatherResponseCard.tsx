import React from 'react';
import {
  ThermometerSun,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

interface WeatherResponseCardProps {
  text: string;
}

interface ParsedSection {
  type: 'conditions' | 'forecast' | 'risk' | 'actions' | 'general';
  title: string;
  icon: any;
  accentBorder: string;
  accentBg: string;
  accentText: string;
  content: string;
}

export const WeatherResponseCard: React.FC<WeatherResponseCardProps> = ({ text = '' }) => {
  // If text is short or simple, render directly
  if (!text) return null;

  // Let's check if the text contains standard structured markers
  const lower = text.toLowerCase();
  const hasStructuredSections =
    (lower.includes('current condition') || lower.includes('conditions:')) ||
    (lower.includes('forecast') || lower.includes('next 24')) ||
    (lower.includes('risk') || lower.includes('hazard')) ||
    (lower.includes('what to do') || lower.includes('recommended action') || lower.includes('advisory'));

  if (!hasStructuredSections) {
    // Return clean rendered text with paragraph breaks
    return (
      <div className="space-y-2 text-sm leading-relaxed text-slate-200">
        {text.split('\n\n').map((paragraph, pIdx) => {
          if (!paragraph.trim()) return null;
          return (
            <p key={pIdx} className="leading-relaxed">
              {renderFormattedInline(paragraph)}
            </p>
          );
        })}
      </div>
    );
  }

  // Parse structured blocks
  const lines = text.split('\n');
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection = {
    type: 'general',
    title: 'Overview',
    icon: Sparkles,
    accentBorder: 'border-white/10',
    accentBg: 'bg-white/[0.02]',
    accentText: 'text-sky-300',
    content: '',
  };

  const finalizeCurrent = () => {
    if (currentSection.content.trim()) {
      sections.push({ ...currentSection, content: currentSection.content.trim() });
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lTrimmed = trimmed.toLowerCase();

    // Check for section headers
    if (
      lTrimmed.includes('current condition') ||
      lTrimmed.startsWith('### current') ||
      lTrimmed.startsWith('**current condition') ||
      lTrimmed.startsWith('1. current')
    ) {
      finalizeCurrent();
      currentSection = {
        type: 'conditions',
        title: 'CURRENT CONDITIONS',
        icon: ThermometerSun,
        accentBorder: 'border-sky-500/40',
        accentBg: 'bg-sky-500/10',
        accentText: 'text-sky-300',
        content: '',
      };
      continue;
    } else if (
      lTrimmed.includes('forecast') ||
      lTrimmed.startsWith('### forecast') ||
      lTrimmed.startsWith('**forecast') ||
      lTrimmed.startsWith('2. forecast')
    ) {
      finalizeCurrent();
      currentSection = {
        type: 'forecast',
        title: 'FORECAST & TIMELINE',
        icon: Calendar,
        accentBorder: 'border-blue-500/40',
        accentBg: 'bg-blue-500/10',
        accentText: 'text-blue-300',
        content: '',
      };
      continue;
    } else if (
      lTrimmed.includes('risk') ||
      lTrimmed.includes('hazard') ||
      lTrimmed.startsWith('### risk') ||
      lTrimmed.startsWith('**risk') ||
      lTrimmed.startsWith('3. risk')
    ) {
      finalizeCurrent();
      currentSection = {
        type: 'risk',
        title: 'RISK & HAZARDS',
        icon: AlertTriangle,
        accentBorder: 'border-amber-500/40',
        accentBg: 'bg-amber-500/10',
        accentText: 'text-amber-300',
        content: '',
      };
      continue;
    } else if (
      lTrimmed.includes('what to do') ||
      lTrimmed.includes('recommended action') ||
      lTrimmed.includes('safety protocol') ||
      lTrimmed.startsWith('### what to do') ||
      lTrimmed.startsWith('**what to do') ||
      lTrimmed.startsWith('4. what to do')
    ) {
      finalizeCurrent();
      currentSection = {
        type: 'actions',
        title: 'WHAT TO DO (ACTIONS)',
        icon: ShieldCheck,
        accentBorder: 'border-emerald-500/40',
        accentBg: 'bg-emerald-500/10',
        accentText: 'text-emerald-300',
        content: '',
      };
      continue;
    }

    currentSection.content += line + '\n';
  }
  finalizeCurrent();

  // If we couldn't segment cleanly, fallback to standard rendered text
  if (sections.length <= 1 && sections[0]?.type === 'general') {
    return (
      <div className="space-y-2 text-sm leading-relaxed text-slate-200">
        {text.split('\n\n').map((paragraph, pIdx) => (
          <p key={pIdx} className="leading-relaxed">
            {renderFormattedInline(paragraph)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 my-1">
      {sections.map((section, sIdx) => {
        const Icon = section.icon;
        return (
          <div
            key={sIdx}
            className={`rounded-2xl border ${section.accentBorder} ${section.accentBg} p-3.5 space-y-2 transition-all shadow-sm`}
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-lg ${section.accentBg} ${section.accentText}`}>
                <Icon className="w-4 h-4" />
              </div>
              <h4 className={`text-xs font-black tracking-wider uppercase ${section.accentText}`}>
                {section.title}
              </h4>
            </div>

            {/* Content lines */}
            <div className="text-xs sm:text-sm text-slate-200 space-y-1.5 leading-relaxed pl-1">
              {section.content.split('\n').map((line, lIdx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;

                // Check for bullet points
                if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                      <span>{renderFormattedInline(trimmed.substring(2))}</span>
                    </div>
                  );
                }

                // Check for numbered items
                const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
                if (numberedMatch) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2">
                      <span className="font-bold text-slate-400 font-mono text-[11px] mt-0.5">
                        {numberedMatch[1]}.
                      </span>
                      <span>{renderFormattedInline(numberedMatch[2])}</span>
                    </div>
                  );
                }

                return (
                  <p key={lIdx} className="leading-relaxed">
                    {renderFormattedInline(trimmed)}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper to format inline bold, emojis, and chips
function renderFormattedInline(text: string): React.ReactNode {
  // Replace bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-white">
          {part.substring(2, part.length - 2)}
        </strong>
      );
    }
    return part;
  });
}
