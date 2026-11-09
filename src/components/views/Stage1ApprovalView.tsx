import React, { useState } from 'react';
import { stage1Deliverables } from '../../data/stage1Deliverables';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Send, 
  CheckCircle, 
  AlertCircle,
  FolderCheck,
  Award
} from 'lucide-react';

interface Stage1ApprovalViewProps {
  onBackToDeliverables: () => void;
  onApproveStage1: (notes: string) => void;
}

export const Stage1ApprovalView: React.FC<Stage1ApprovalViewProps> = ({
  onBackToDeliverables,
  onApproveStage1
}) => {
  const [reviewedItems, setReviewedItems] = useState<{ [key: string]: boolean }>({
    'srs': true,
    'architecture': true,
    'screens-design': true,
    'navigation-flow': true,
    'db-schema': true,
    'rbac-matrix': true,
    'lifecycle': true,
    'api-specs': true,
    'test-plan': true,
    'cost-estimate': true
  });

  const [engineerNotes, setEngineerNotes] = useState<string>(
    'تمت مراجعة جميع وثائق المرحلة الأولى بدقة من قِبل الفريق الهندسي (مهندس البرمجيات، مهندس الأرصاد، خبير GIS، مهندس قواعد البيانات، مصمم UX، ومختص أمن المعلومات). التصاميم والهيكلية البرمجية جاهزة بالكامل لبدء المرحلة 2: تثبيت الهيكل التقني ومخطط قاعدة البيانات وERD.'
  );

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const allReviewed = Object.values(reviewedItems).every(v => v);

  const toggleReview = (id: string) => {
    setReviewedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitApproval = () => {
    setIsSubmitted(true);
    onApproveStage1(engineerNotes);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-xl p-6 shadow-xl text-right">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold text-amber-300">
            بوابة المراجعة والاعتماد الرسمي للمرحلة الأولى
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          اعتماد التصاميم والمخططات الهندسية لنظام WAMS
        </h2>
        <p className="text-sm text-slate-300 mt-1 leading-relaxed">
          بموجب الشروط الإلزامية للمشروع (البند 22 و 23): يجب مراجعة مخرجات المرحلة الأولى بالكامل وتأكيد مطابقتها لجميع متطلبات الأرصاد والـ GIS ومعيار CAP 1.2 قبل الانتقال إلى المرحلة الثانية.
        </p>
      </div>

      {/* Review Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">قائمة التحقق لمخرجات المرحلة الأولى (10 مخرجات)</h3>
            <span className="text-xs text-slate-400">انقر على أي بند للتأكد من مراجعته</span>
          </div>
          <button
            onClick={() => {
              const allChecked = Object.keys(reviewedItems).reduce((acc, k) => ({ ...acc, [k]: true }), {});
              setReviewedItems(allChecked);
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            تحديد الكل كمراجع ومقبول
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stage1Deliverables.map(d => {
            const isChecked = !!reviewedItems[d.id];
            return (
              <div
                key={d.id}
                onClick={() => toggleReview(d.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${isChecked ? 'bg-slate-950/80 border-emerald-500/50 text-slate-200' : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'}`}>
                  {isChecked && <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{d.number}. {d.titleAr}</span>
                    <span className="text-[10px] text-slate-500 font-mono">#{d.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{d.summaryAr}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engineering Sign-off Notes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <MessageSquare className="w-4 h-4 text-sky-400" />
          <span>ملاحظات وقرار الاعتماد (Sign-Off Notes):</span>
        </div>

        <textarea
          value={engineerNotes}
          onChange={(e) => setEngineerNotes(e.target.value)}
          rows={4}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
          placeholder="اكتب أي ملاحظات أو توجيهات إضافية للتنفيذ..."
        />

        {isSubmitted ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/60 rounded-xl flex items-center gap-3 text-emerald-200 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold block text-sm">تم تسجيل الاعتماد بنجاح!</span>
              <span>تم توثيق موافقتك على مخرجات المرحلة الأولى. النظام جاهز الآن للبدء في المرحلة الثانية.</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              onClick={onBackToDeliverables}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              العودة لاستعراض الوثائق والمخططات التفصيلية
            </button>

            <button
              onClick={handleSubmitApproval}
              disabled={!allReviewed}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>تأكيد اعتماد المرحلة الأولى والجاهزية للمرحلة 2</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
