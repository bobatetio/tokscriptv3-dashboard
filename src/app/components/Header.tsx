import { ChevronDown } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="5" r="4" fill="white" />
            </svg>
          </div>
          <span className="text-gray-900 font-medium">Solaris</span>
        </div>
        <nav className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm">Products</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">NEW</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-700 text-sm">Solutions</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="text-gray-700 text-sm">Resources</span>
            <span className="text-gray-700 text-sm">Pricing</span>
            <span className="text-gray-700 text-sm">Contact</span>
          </div>
        </nav>
      </div>
      <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
        Request a demo
      </button>
    </header>
  );
}
