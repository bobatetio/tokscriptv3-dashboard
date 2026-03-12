import { ArrowRight } from 'lucide-react';

export function ChatMockup() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 pb-16">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden p-8">
        <textarea
          placeholder="Type your message here..."
          className="w-full min-h-[400px] p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>
    </section>
  );
}