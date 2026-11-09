/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, X, ShieldAlert, Database, Server, Users, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';

export interface ModuleHelpInfo {
  titleAr: string;
  functionAr: string;
  howItWorksAr: string;
  dataSourcesAr: string[];
  backendDbIntegrationAr: string;
  beneficiariesAr: string[];
  howToUseAr: string[];
  requiredRolesAr: string[];
  implementationStatusAr: string;
  limitationsAr: string[];
}

interface ModuleHelpModalProps {
  info: ModuleHelpInfo;
  buttonClassName?: string;
}

export const ModuleHelpButton: React.FC<ModuleHelpModalProps> = ({ info, buttonClassName }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClassName || "inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-colors text-xs font-semibold shadow-sm cursor-pointer"}
        title="دليل فهم وإرشادات الوحدة الوطنية (?)"
        aria-label="افتخ الشرح التفاعلي"
      >
        <HelpCircle className="w-4 h-4 text-blue-400" />
        <span>دليل الوحدة (?)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{info.titleAr}</h3>
                  <p className="text-xs text-slate-400">دليل الفهم والمعمارية التقنية والتكامل مع قواعد البيانات</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-sm">

              {/* 1. وظيفة الوحدة */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                  <ShieldAlert className="w-4 h-4 text-blue-400" />
                  ما وظيفة هذه الوحدة؟
                </h4>
                <p className="leading-relaxed text-slate-200">{info.functionAr}</p>
              </div>

              {/* 2. كيف تعمل */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  كيف تعمل؟
                </h4>
                <p className="leading-relaxed text-slate-200">{info.howItWorksAr}</p>
              </div>

              {/* 3. مصادر البيانات والتكامل مع الباك إند */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                  <h4 className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    من أين تأتي البيانات؟
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                    {info.dataSourcesAr.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                  <h4 className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                    <Server className="w-4 h-4 text-amber-400" />
                    التكامل مع الباك إند وقاعدة البيانات
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{info.backendDbIntegrationAr}</p>
                </div>
              </div>

              {/* 4. الجهات المستفيدة وكيفية الاستخدام */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                  <h4 className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    الجهات المستفيدة
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {info.beneficiariesAr.map((b, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-md text-xs">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                  <h4 className="flex items-center gap-2 text-rose-400 font-bold mb-2">
                    <Lock className="w-4 h-4 text-rose-400" />
                    الصلاحيات المطلوبة (RBAC)
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {info.requiredRolesAr.map((role, i) => (
                      <span key={i} className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-md text-xs font-mono">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. خطوة بخطوة كيفية الاستخدام */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <h4 className="flex items-center gap-2 text-sky-400 font-bold mb-2">
                  كيف تُستخدم؟ (خطوات تشغيلية)
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                  {info.howToUseAr.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* 6. حالة التنفيذ والربط الفعلي */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">حالة التنفيذ والربط الفعلي</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded">
                    {info.implementationStatusAr}
                  </span>
                </div>
              </div>

              {/* 7. القيود والتحذيرات العلمية */}
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4">
                <h4 className="flex items-center gap-2 text-amber-400 font-bold mb-2 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  القيود والتحذيرات العلمية
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-amber-200/90">
                  {info.limitationsAr.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                فهمت وتأكيد الإرشادات
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
