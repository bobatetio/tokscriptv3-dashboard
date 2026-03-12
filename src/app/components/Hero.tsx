import { ArrowRight, CheckCircle2, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 pt-12 pb-8">
      <div className="flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full mb-8">
          <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">NEW</span>
          <span className="text-sm text-gray-700">Experience next-gen AI chat</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl text-gray-900 mb-4 tracking-tight max-w-3xl">
          Your intelligent AI chat partner
        </h1>

        {/* Subheadline */}
        <p className="text-gray-600 text-lg mb-8">
          AI-powered chat assistance for every task and question
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mb-12">
          <button className="px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2">
            Start chatting free
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Play className="w-4 h-4 text-green-500" />
            See how it works
          </button>
        </div>

        {/* Feature Pills */}
        <div className="flex items-center gap-8 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Get accurate answers in seconds</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Automate tasks and save time</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Integrate with your favorite tools</span>
          </div>
        </div>
      </div>
    </section>
  );
}
