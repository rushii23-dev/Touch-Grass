'use client';

import React from 'react';
import { Mic, Lock, Compass, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { WaterfallProgress } from '@/lib/sensors/permissionWaterfall';

interface PermissionWaterfallModalProps {
  progress: WaterfallProgress | null;
  onRetry: () => void;
  onCancel: () => void;
}

export function PermissionWaterfallModal({
  progress,
  onRetry,
  onCancel,
}: PermissionWaterfallModalProps) {
  if (!progress) return null;

  const steps = [
    {
      id: 'microphone',
      name: 'Microphone Stream',
      description: 'Hands-free ambient voice capture during your walk',
      icon: Mic,
    },
    {
      id: 'wakeLock',
      name: 'Screen Wake Lock',
      description: 'Prevents display sleep so the session continues in your pocket',
      icon: Lock,
    },
    {
      id: 'orientation',
      name: 'Pocket Sensor (Gyroscope)',
      description: 'Angle detection to guarantee 100% screen-free presence',
      icon: Compass,
    },
  ];

  const getStepStatus = (stepId: string) => {
    if (progress.status === 'error' && progress.step === stepId) return 'error';
    if (progress.step === 'complete') return 'success';

    const stepOrder = ['microphone', 'wakeLock', 'orientation'];
    const currentIndex = stepOrder.indexOf(progress.step);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'success';
    if (stepIndex === currentIndex) {
      return progress.status === 'running' ? 'running' : 'success';
    }
    return 'pending';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#0C0E13] border border-white/[0.1] p-6 sm:p-7 shadow-2xl text-[#F5F5F7]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 id="modal-title" className="text-xl font-semibold tracking-tight text-white">
            Calibrating Sensors
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Activating hands-free audio and pocket tilt detection for your walk.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 mb-6">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all duration-200 ${
                  status === 'running'
                    ? 'bg-emerald-500/[0.06] border-emerald-500/30 text-white'
                    : status === 'success'
                    ? 'bg-white/[0.025] border-white/[0.08] text-zinc-200'
                    : status === 'error'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : 'bg-white/[0.01] border-white/[0.05] text-zinc-500'
                }`}
              >
                <div
                  className={`p-2 rounded-lg border shrink-0 transition-colors ${
                    status === 'running'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : status === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : status === 'error'
                      ? 'bg-rose-900/30 border-rose-500/40 text-rose-300'
                      : 'bg-white/[0.02] border-white/[0.05] text-zinc-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {step.name}
                    </span>
                    <span className="shrink-0 ml-2">
                      {status === 'running' && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      )}
                      {status === 'success' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {status === 'error' && (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Handling */}
        {progress.status === 'error' && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200">
            <p className="font-semibold mb-0.5 text-rose-300">Permission Action Required</p>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              {progress.errorMessage || 'One of the sensor permissions was declined.'}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={onRetry}
                className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition cursor-pointer"
              >
                Retry Calibration
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cancel Button */}
        {progress.status !== 'error' && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition py-1 font-medium cursor-pointer"
            >
              Cancel Calibration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
