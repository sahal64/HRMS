import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { Plus, Download, Search, Filter } from 'lucide-react';

export interface ModulePageConfig {
  moduleKey: string;
  title: string;
  description: string;
  phase: string;
  sampleRecords: {
    id: string;
    col1: string;
    col2: string;
    col3: string;
    status: string;
  }[];
  tableHeaders: [string, string, string, string];
  actionButtonText?: string;
  onAction?: () => void;
}

export const ModulePlaceholderPage: React.FC<ModulePageConfig> = ({
  title,
  description,
  sampleRecords,
  tableHeaders,
  actionButtonText = 'Add Record',
}) => {
  const { currentOrganization } = useOrganization();
  const [records] = useState(sampleRecords);
  const [search, setSearch] = useState('');

  const handleSimulateAction = () => {
    alert(`Action initiated for ${title} under ${currentOrganization.name}!`);
  };

  const filtered = records.filter(
    (r) =>
      r.col1.toLowerCase().includes(search.toLowerCase()) ||
      r.col2.toLowerCase().includes(search.toLowerCase()) ||
      r.col3.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3.5">
      <PageHeader
        title={title}
        description={`${description} for ${currentOrganization.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: title }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-white border-[#ece8e1] text-stone-700 hover:bg-[#faf9f5]"
              onClick={() => alert(`Exporting CSV dataset for ${title}...`)}
            >
              <Download className="h-3 w-3 mr-1 text-stone-400" />
              Export
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={handleSimulateAction}>
              <Plus className="h-3 w-3 mr-1" />
              {actionButtonText}
            </Button>
          </div>
        }
      />

      {/* Clean Table Container (Lighter borders, no artificial AI capabilities box) */}
      <div className="rounded-xl border border-[#ece8e1] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Search & Filter Header Bar */}
        <div className="flex items-center justify-between p-3 border-b border-[#f0ede6] bg-[#faf9f5]/80">
          <div className="flex items-center gap-2 w-full max-w-xs">
            <Search className="h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 outline-none"
            />
          </div>
          <span className="text-[11px] font-medium text-stone-400">
            {filtered.length} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-800">
            <thead className="bg-[#faf9f5] text-[11px] font-semibold text-stone-500 border-b border-[#ece8e1]">
              <tr>
                <th className="px-4 py-2.5 font-semibold text-stone-600">{tableHeaders[0]}</th>
                <th className="px-4 py-2.5 font-semibold text-stone-600">{tableHeaders[1]}</th>
                <th className="px-4 py-2.5 font-semibold text-stone-600">{tableHeaders[2]}</th>
                <th className="px-4 py-2.5 font-semibold text-stone-600">{tableHeaders[3]}</th>
                <th className="px-4 py-2.5 font-semibold text-right text-stone-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f1ea]">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#faf9f5] transition-colors">
                  <td className="px-4 py-2.5 font-semibold text-stone-900">{rec.col1}</td>
                  <td className="px-4 py-2.5 text-stone-600">{rec.col2}</td>
                  <td className="px-4 py-2.5 text-stone-500 font-mono text-[11px]">{rec.col3}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={rec.status} />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-[11px] px-2 border-[#e5e2d9] text-stone-600 hover:bg-[#faf9f5]"
                      onClick={() => alert(`Reviewing record "${rec.col1}"`)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-xs text-stone-400 italic">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
