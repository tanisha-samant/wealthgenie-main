import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Download, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { exportApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface ExportModalProps {
  accessToken: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportModal({ accessToken, open, onOpenChange }: ExportModalProps) {
  const [exportOptions, setExportOptions] = useState({
    income: true,
    expenses: true,
    savings: true,
    categories: true,
    emis: true,
    summary: true,
  });
  const [exported, setExported] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await exportApi.getData(accessToken);
      
      // Create JSON blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wealthgenie-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExported(true);
      toast.success("Data exported successfully!");
      
      setTimeout(() => {
        setExported(false);
        onOpenChange(false);
      }, 2000);
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleOption = (key: keyof typeof exportOptions) => {
    setExportOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            Export Financial Data
          </DialogTitle>
          <DialogDescription>
            Choose which data to include in your Excel export
          </DialogDescription>
        </DialogHeader>

        {exported ? (
          <div className="py-8 text-center space-y-4">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-1">Export Successful!</h3>
              <p className="text-sm text-gray-600">Your file has been downloaded</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="income"
                    checked={exportOptions.income}
                    onCheckedChange={() => toggleOption("income")}
                  />
                  <Label htmlFor="income" className="cursor-pointer">
                    <div>
                      <p className="text-sm text-gray-900">Income Data</p>
                      <p className="text-xs text-gray-600">All income sources and monthly trends</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="expenses"
                    checked={exportOptions.expenses}
                    onCheckedChange={() => toggleOption("expenses")}
                  />
                  <Label htmlFor="expenses" className="cursor-pointer">
                    <div>
                      <p className="text-sm text-gray-900">Expense Data</p>
                      <p className="text-xs text-gray-600">Detailed expense transactions</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="savings"
                    checked={exportOptions.savings}
                    onCheckedChange={() => toggleOption("savings")}
                  />
                  <Label htmlFor="savings" className="cursor-pointer">
                    <div>
                      <p className="text-sm text-gray-900">Savings & Goals</p>
                      <p className="text-xs text-gray-600">Savings goals and progress</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="categories"
                    checked={exportOptions.categories}
                    onCheckedChange={() => toggleOption("categories")}
                  />
                  <Label htmlFor="categories" className="cursor-pointer">
                    <div>
                      <p className="text-sm text-gray-900">Category Breakdown</p>
                      <p className="text-xs text-gray-600">Spending by category</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="emis"
                    checked={exportOptions.emis}
                    onCheckedChange={() => toggleOption("emis")}
                  />
                  <Label htmlFor="emis" className="cursor-pointer">
                    <div>
                      <p className="text-sm text-gray-900">EMI & Loans</p>
                      <p className="text-xs text-gray-600">Loan details and payment schedule</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="summary"
                    checked={exportOptions.summary}
                    onCheckedChange={() => toggleOption("summary")}
                  />
                  <Label htmlFor="summary" className="cursor-pointer">
                    <div>
                      <p className="text-sm text-gray-900">Executive Summary</p>
                      <p className="text-xs text-gray-600">Overview and key metrics</p>
                    </div>
                  </Label>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <h4 className="text-blue-900 mb-1">Export Format</h4>
                  <p className="text-blue-700">
                    Data will be exported as an Excel file (.xlsx) with separate sheets for each selected category.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleExport}
                disabled={!Object.values(exportOptions).some(v => v) || isExporting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Download Data (JSON)"}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
