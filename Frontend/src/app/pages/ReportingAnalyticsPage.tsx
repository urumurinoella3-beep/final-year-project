import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { FileDown, Calendar, FileSpreadsheet, FileText } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, Packer } from 'docx';
import { saveAs } from 'file-saver';
import rraLogo from '../../assets/e686ed0804a4cc454121e4635af36398ddb2058a.png';

const COLORS = ['#20603D', '#00A1DE', '#E5BE01', '#EF4444', '#8B5CF6', '#EC4899'];

export function ReportingAnalyticsPage() {
  const { currentUser, issues, users } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<string>('30');
  const [useCustomDateRange, setUseCustomDateRange] = useState(false);
  const [startDateTime, setStartDateTime] = useState<string>('');
  const [endDateTime, setEndDateTime] = useState<string>('');

  if (!currentUser) return null;

  // Function to filter issues by date/time range
  const filterIssuesByDateRange = (issueList: typeof issues) => {
    if (!useCustomDateRange) {
      // Use preset date range (no time filtering)
      const days = parseInt(dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return issueList.filter((i) => new Date(i.createdAt) >= cutoffDate);
    } else {
      // Use custom date/time range with strict filtering
      let filtered = issueList;
      
      if (startDateTime) {
        const startDate = new Date(startDateTime);
        filtered = filtered.filter((i) => new Date(i.createdAt) >= startDate);
      }
      
      if (endDateTime) {
        const endDate = new Date(endDateTime);
        filtered = filtered.filter((i) => new Date(i.createdAt) <= endDate);
      }
      
      return filtered;
    }
  };

  const departmentFilteredIssues = selectedDepartment === 'ALL'
    ? currentUser.role === 'ADMIN'
      ? issues
      : issues.filter((i) => i.department === currentUser.department)
    : issues.filter((i) => i.department === selectedDepartment);

  const filteredIssues = filterIssuesByDateRange(departmentFilteredIssues);

  const issuesByDepartment = ['VAT', 'CUSTOMS', 'DOMESTIC TAX', 'IT'].map((dept) => ({
    name: dept,
    total: issues.filter((i) => i.department === dept).length,
    open: issues.filter((i) => i.department === dept && i.status === 'OPEN').length,
    resolved: issues.filter((i) => i.department === dept && (i.status === 'RESOLVED' || i.status === 'CLOSED')).length,
  }));

  const issuesByStatus = [
    { name: 'Open', value: filteredIssues.filter((i) => i.status === 'OPEN').length, color: '#EF4444' },
    { name: 'In Progress', value: filteredIssues.filter((i) => i.status === 'IN_PROGRESS').length, color: '#E5BE01' },
    { name: 'Resolved', value: filteredIssues.filter((i) => i.status === 'RESOLVED').length, color: '#20603D' },
    { name: 'Closed', value: filteredIssues.filter((i) => i.status === 'CLOSED').length, color: '#6B7280' },
  ];

  const issuesByPriority = [
    { name: 'High', value: filteredIssues.filter((i) => i.priority === 'HIGH').length, color: '#EF4444' },
    { name: 'Medium', value: filteredIssues.filter((i) => i.priority === 'MEDIUM').length, color: '#E5BE01' },
    { name: 'Low', value: filteredIssues.filter((i) => i.priority === 'LOW').length, color: '#20603D' },
  ];

  const issuesBySeverity = [
    { name: 'Critical', value: filteredIssues.filter((i) => i.severity === 'CRITICAL').length },
    { name: 'High', value: filteredIssues.filter((i) => i.severity === 'HIGH').length },
    { name: 'Medium', value: filteredIssues.filter((i) => i.severity === 'MEDIUM').length },
    { name: 'Low', value: filteredIssues.filter((i) => i.severity === 'LOW').length },
  ];

  const generatePDF = async () => {
    const doc = new jsPDF();

    // ============================================
    // SECTION 1: REPORT HEADER WITH RRA LOGO
    // ============================================

    // Add RRA Logo
    try {
      // Load the logo image
      const img = new Image();
      img.src = rraLogo;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Add logo to PDF (top left)
      doc.addImage(img, 'PNG', 15, 10, 25, 25);
    } catch (error) {
      console.error('Error loading logo:', error);
      // Fallback: Draw colored box with RRA text
      doc.setFillColor(32, 96, 61);
      doc.rect(15, 10, 25, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text('RRA', 27.5, 25, { align: 'center' });
    }

    // Report title based on role
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    let reportTitle = '';
    if (currentUser.role === 'ADMIN') {
      reportTitle = 'DQIMS System-Wide Report';
    } else if (currentUser.role === 'HOD') {
      reportTitle = `DQIMS ${currentUser.department} Department Report`;
    } else {
      reportTitle = 'DQIMS Personal Issue Report';
    }
    doc.text(reportTitle, 105, 18, { align: 'center' });

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Rwanda Revenue Authority', 105, 25, { align: 'center' });
    doc.text('Data Quality Issues Management System', 105, 30, { align: 'center' });

    // Report metadata
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`Report Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, 20, 40);
    doc.text(`Generated By: ${currentUser.name}`, 20, 45);
    doc.text(`Role: ${currentUser.role}`, 20, 50);
    if (currentUser.role !== 'ADMIN') {
      doc.text(`Department: ${currentUser.department}`, 20, 55);
    }

    // Date/Time filter information
    let yPos = 55;
    if (useCustomDateRange && (startDateTime || endDateTime)) {
      yPos += 5;
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 139);
      doc.text('Date/Time Filter Applied:', 20, yPos);
      yPos += 4;
      if (startDateTime) {
        doc.text(`  From: ${new Date(startDateTime).toLocaleString('en-GB')}`, 20, yPos);
        yPos += 4;
      }
      if (endDateTime) {
        doc.text(`  To: ${new Date(endDateTime).toLocaleString('en-GB')}`, 20, yPos);
        yPos += 4;
      }
      doc.setTextColor(0, 0, 0);
    }

    // Horizontal line
    doc.setDrawColor(32, 96, 61);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 5, 190, yPos + 5);
    yPos += 5;

    // ============================================
    // SECTION 2: SUMMARY SECTION
    // ============================================

    doc.setFontSize(14);
    doc.setTextColor(32, 96, 61);
    yPos += 5;
    doc.text('Executive Summary', 20, yPos);

    // Summary boxes
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    const openCount = filteredIssues.filter((i) => i.status === 'OPEN').length;
    const inProgressCount = filteredIssues.filter((i) => i.status === 'IN_PROGRESS').length;
    const resolvedCount = filteredIssues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
    const highPriorityCount = filteredIssues.filter((i) => i.priority === 'HIGH').length;

    // Draw summary boxes
    const boxWidth = 40;
    const boxHeight = 20;
    const boxY = yPos;

    // Total Issues box
    doc.setFillColor(240, 240, 240);
    doc.rect(20, boxY, boxWidth, boxHeight, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Total Issues', 40, boxY + 7, { align: 'center' });
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(String(filteredIssues.length), 40, boxY + 16, { align: 'center' });

    // Open Issues box
    doc.setFillColor(254, 226, 226);
    doc.rect(65, boxY, boxWidth, boxHeight, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Open', 85, boxY + 7, { align: 'center' });
    doc.setFontSize(16);
    doc.setTextColor(239, 68, 68);
    doc.text(String(openCount), 85, boxY + 16, { align: 'center' });

    // In Progress box
    doc.setFillColor(254, 243, 199);
    doc.rect(110, boxY, boxWidth, boxHeight, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('In Progress', 130, boxY + 7, { align: 'center' });
    doc.setFontSize(16);
    doc.setTextColor(229, 190, 1);
    doc.text(String(inProgressCount), 130, boxY + 16, { align: 'center' });

    // Resolved box
    doc.setFillColor(220, 252, 231);
    doc.rect(155, boxY, boxWidth, boxHeight, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Resolved', 175, boxY + 7, { align: 'center' });
    doc.setFontSize(16);
    doc.setTextColor(32, 96, 61);
    doc.text(String(resolvedCount), 175, boxY + 16, { align: 'center' });

    yPos += boxHeight + 10;

    // Key metrics
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`High Priority Issues: ${highPriorityCount}`, 20, yPos);
    yPos += 5;
    const resolutionRate = filteredIssues.length > 0 ? Math.round((resolvedCount / filteredIssues.length) * 100) : 0;
    doc.text(`Resolution Rate: ${resolutionRate}%`, 20, yPos);
    yPos += 5;
    if (currentUser.role === 'ADMIN') {
      doc.text(`Active Departments: ${issuesByDepartment.filter(d => d.total > 0).length}`, 20, yPos);
      yPos += 5;
    }

    // ============================================
    // SECTION 3: CHART SECTION
    // ============================================

    yPos += 5;
    doc.setFontSize(14);
    doc.setTextColor(32, 96, 61);
    doc.text('Data Visualization', 20, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Note: Charts are displayed in the online dashboard. This section shows the data breakdown.', 20, yPos);
    yPos += 8;

    // Status breakdown
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Status Distribution:', 20, yPos);
    yPos += 6;
    doc.setFontSize(9);
    issuesByStatus.forEach((status) => {
      if (status.value > 0) {
        const percentage = filteredIssues.length > 0 ? Math.round((status.value / filteredIssues.length) * 100) : 0;
        doc.text(`  ${status.name}: ${status.value} (${percentage}%)`, 25, yPos);
        yPos += 5;
      }
    });

    yPos += 3;
    // Priority breakdown
    doc.setFontSize(10);
    doc.text('Priority Distribution:', 20, yPos);
    yPos += 6;
    doc.setFontSize(9);
    issuesByPriority.forEach((priority) => {
      if (priority.value > 0) {
        const percentage = filteredIssues.length > 0 ? Math.round((priority.value / filteredIssues.length) * 100) : 0;
        doc.text(`  ${priority.name}: ${priority.value} (${percentage}%)`, 25, yPos);
        yPos += 5;
      }
    });

    // Department breakdown for Admin
    if (currentUser.role === 'ADMIN') {
      yPos += 3;
      doc.setFontSize(10);
      doc.text('Department Breakdown:', 20, yPos);
      yPos += 6;
      doc.setFontSize(9);
      issuesByDepartment.forEach((dept) => {
        if (dept.total > 0) {
          doc.text(`  ${dept.name}: ${dept.total} total (${dept.open} open, ${dept.resolved} resolved)`, 25, yPos);
          yPos += 5;
        }
      });
    }

    // ============================================
    // SECTION 4: DETAILS TABLE
    // ============================================

    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos += 5;
    }

    doc.setFontSize(14);
    doc.setTextColor(32, 96, 61);
    doc.text('Issue Details', 20, yPos);
    yPos += 8;

    // Table header
    doc.setFillColor(32, 96, 61);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('ID', 22, yPos);
    doc.text('Title', 35, yPos);
    doc.text('Status', 95, yPos);
    doc.text('Priority', 120, yPos);
    doc.text('Department', 145, yPos);
    yPos += 5;

    // Table rows
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    const issuesToShow = filteredIssues.slice(0, 20);
    issuesToShow.forEach((issue, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(20, yPos - 4, 170, 6, 'F');
      }

      doc.text(`#${issue.id}`, 22, yPos);
      const truncatedTitle = issue.title.length > 35 ? issue.title.substring(0, 32) + '...' : issue.title;
      doc.text(truncatedTitle, 35, yPos);
      doc.text(issue.status.replace('_', ' '), 95, yPos);
      doc.text(issue.priority, 120, yPos);
      doc.text(issue.department, 145, yPos);
      yPos += 6;
    });

    if (filteredIssues.length > 20) {
      yPos += 3;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Showing 20 of ${filteredIssues.length} total issues. View full details in the dashboard.`, 20, yPos);
    }

    // ============================================
    // SECTION 5: FOOTER
    // ============================================

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(32, 96, 61);
      doc.setLineWidth(0.3);
      doc.line(20, 282, 190, 282);

      // Footer text
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text('Rwanda Revenue Authority - Data Quality Issues Management System', 105, 287, { align: 'center' });
      doc.text('CONFIDENTIAL - For Internal Use Only', 105, 291, { align: 'center' });
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(`Page ${i} of ${pageCount}`, 190, 287, { align: 'right' });
    }

    const fileName = currentUser.role === 'ADMIN'
      ? `DQIMS_System_Report_${new Date().toISOString().split('T')[0]}.pdf`
      : currentUser.role === 'HOD'
      ? `DQIMS_${currentUser.department}_Report_${new Date().toISOString().split('T')[0]}.pdf`
      : `DQIMS_Personal_Report_${new Date().toISOString().split('T')[0]}.pdf`;

    doc.save(fileName);
  };

  const generateExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Calculate statistics
    const totalIssues = filteredIssues.length;
    const openIssues = filteredIssues.filter((i) => i.status === 'OPEN').length;
    const inProgressIssues = filteredIssues.filter((i) => i.status === 'IN_PROGRESS').length;
    const resolvedIssues = filteredIssues.filter((i) => i.status === 'RESOLVED').length;
    const closedIssues = filteredIssues.filter((i) => i.status === 'CLOSED').length;

    // ============================================
    // SHEET 1: SUMMARY
    // ============================================
    const summaryData = [
      ['RWANDA REVENUE AUTHORITY'],
      ['Data Quality Issues Management System - Excel Report'],
      [],
      ['REPORT METADATA'],
      ['Generated:', new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })],
      ['Generated by:', currentUser.name],
      ['User Role:', currentUser.role],
      ['User Email:', currentUser.email],
      ['Department:', currentUser.role === 'ADMIN' ? 'All Departments' : currentUser.department],
      [],
      ['APPLIED FILTERS'],
      ['Department Filter:', selectedDepartment === 'ALL' ? 'All Departments' : selectedDepartment],
    ];

    // Add date/time filter information
    if (useCustomDateRange) {
      summaryData.push(['Date/Time Mode:', 'Custom Range (Precise Timestamps)']);
      summaryData.push(['Start Date/Time:', startDateTime ? new Date(startDateTime).toLocaleString('en-GB') : 'Not Set']);
      summaryData.push(['End Date/Time:', endDateTime ? new Date(endDateTime).toLocaleString('en-GB') : 'Not Set']);
    } else {
      summaryData.push(['Date Range:', `Last ${dateRange} days`]);
    }

    summaryData.push([]);
    summaryData.push(['SUMMARY STATISTICS']);
    summaryData.push(['Total Issues:', totalIssues]);
    summaryData.push(['Open Issues:', openIssues]);
    summaryData.push(['In Progress:', inProgressIssues]);
    summaryData.push(['Resolved:', resolvedIssues]);
    summaryData.push(['Closed:', closedIssues]);
    summaryData.push(['Completion Rate:', `${totalIssues > 0 ? Math.round((closedIssues / totalIssues) * 100) : 0}%`]);
    summaryData.push([]);
    summaryData.push(['ISSUES BY DEPARTMENT']);

    // Add department breakdown
    issuesByDepartment.forEach((dept) => {
      if (dept.total > 0) {
        summaryData.push([dept.name + ':', dept.total, `(${dept.open} open, ${dept.resolved} resolved)`]);
      }
    });

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Set column widths for summary sheet
    summarySheet['!cols'] = [
      { wch: 25 },
      { wch: 20 },
      { wch: 30 }
    ];

    // Apply professional styling to summary sheet
    // Header styling (RRA Green background)
    if (summarySheet['A1']) {
      summarySheet['A1'].s = {
        font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '20603D' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }
    if (summarySheet['A2']) {
      summarySheet['A2'].s = {
        font: { bold: true, sz: 12, color: { rgb: '20603D' } },
        alignment: { horizontal: 'center' }
      };
    }

    // Section headers (green background)
    ['A4', 'A11', 'A15', 'A23'].forEach(cell => {
      if (summarySheet[cell]) {
        summarySheet[cell].s = {
          font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '20603D' } },
          alignment: { horizontal: 'left', vertical: 'center' }
        };
      }
    });

    // ============================================
    // SHEET 2: ISSUES
    // ============================================
    const issuesData = [
      ['ID', 'Title', 'Description', 'Status', 'Priority', 'Severity', 'Department', 'Reported By', 'Assigned To', 'Created Date', 'Updated Date']
    ];

    filteredIssues.forEach((issue) => {
      issuesData.push([
        issue.id,
        issue.title,
        issue.description,
        issue.status,
        issue.priority,
        issue.severity,
        issue.department,
        issue.reportedBy?.name || 'Unknown',
        issue.assignedTo?.name || 'Unassigned',
        new Date(issue.createdAt).toLocaleDateString('en-GB'),
        new Date(issue.updatedAt).toLocaleDateString('en-GB')
      ]);
    });

    const issuesSheet = XLSX.utils.aoa_to_sheet(issuesData);

    // Set column widths for issues sheet
    issuesSheet['!cols'] = [
      { wch: 8 },
      { wch: 30 },
      { wch: 40 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 }
    ];

    // Apply professional styling to issues sheet header (RRA Green)
    const issuesHeaderCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1'];
    issuesHeaderCells.forEach(cell => {
      if (issuesSheet[cell]) {
        issuesSheet[cell].s = {
          font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '20603D' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          }
        };
      }
    });

    // ============================================
    // SHEET 3: STATISTICS
    // ============================================
    const statisticsData = [
      ['DETAILED STATISTICS'],
      [],
      ['Issues by Status'],
      ['Status', 'Count', 'Percentage'],
    ];

    issuesByStatus.forEach((status) => {
      const percentage = totalIssues > 0 ? Math.round((status.value / totalIssues) * 100) : 0;
      statisticsData.push([status.name, status.value, `${percentage}%`]);
    });

    statisticsData.push([]);
    statisticsData.push(['Issues by Priority']);
    statisticsData.push(['Priority', 'Count', 'Percentage']);

    issuesByPriority.forEach((priority) => {
      const percentage = totalIssues > 0 ? Math.round((priority.value / totalIssues) * 100) : 0;
      statisticsData.push([priority.name, priority.value, `${percentage}%`]);
    });

    statisticsData.push([]);
    statisticsData.push(['Issues by Severity']);
    statisticsData.push(['Severity', 'Count', 'Percentage']);

    issuesBySeverity.forEach((severity) => {
      const percentage = totalIssues > 0 ? Math.round((severity.value / totalIssues) * 100) : 0;
      statisticsData.push([severity.name, severity.value, `${percentage}%`]);
    });

    const statisticsSheet = XLSX.utils.aoa_to_sheet(statisticsData);

    // Set column widths for statistics sheet
    statisticsSheet['!cols'] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 }
    ];

    // Apply professional styling to statistics sheet
    // Main header
    if (statisticsSheet['A1']) {
      statisticsSheet['A1'].s = {
        font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '20603D' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }

    // Section headers (green background)
    ['A3', 'A4', 'A10', 'A11', 'A17', 'A18'].forEach(cell => {
      if (statisticsSheet[cell]) {
        statisticsSheet[cell].s = {
          font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '20603D' } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }
    });

    // Column headers
    ['B4', 'C4', 'B11', 'C11', 'B18', 'C18'].forEach(cell => {
      if (statisticsSheet[cell]) {
        statisticsSheet[cell].s = {
          font: { bold: true, sz: 10, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '20603D' } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }
    });

    // ============================================
    // SHEET 4: ACTIVITY LOG
    // ============================================
    const activityLogData = [
      ['ACTIVITY LOG & AUDIT TRAIL'],
      ['Comprehensive activity tracking for all issues with lifecycle information'],
      [],
      ['Issue ID', 'Title', 'Current Action', 'Status', 'Priority', 'Reported By', 'Assigned To', 'Last Updated', 'Days Open', 'URGENT']
    ];

    const urgentRows: number[] = []; // Track rows with urgent issues for yellow highlighting

    filteredIssues.forEach((issue, index) => {
      const daysOpen = Math.floor((new Date().getTime() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const isUrgent = (issue.status === 'OPEN' || issue.status === 'IN_PROGRESS') && daysOpen > 7;
      
      if (isUrgent) {
        urgentRows.push(index + 5); // +5 because of header rows (1-indexed in Excel, +4 for headers)
      }

      let currentAction = 'Unknown';
      switch (issue.status) {
        case 'OPEN':
          currentAction = 'Issue Reported';
          break;
        case 'IN_PROGRESS':
          currentAction = 'Work In Progress';
          break;
        case 'RESOLVED':
          currentAction = 'Issue Resolved';
          break;
        case 'CLOSED':
          currentAction = 'Issue Closed';
          break;
      }

      activityLogData.push([
        issue.id,
        issue.title,
        currentAction,
        issue.status,
        issue.priority,
        issue.reportedBy?.name || 'Unknown',
        issue.assignedTo?.name || 'Unassigned',
        new Date(issue.updatedAt).toLocaleDateString('en-GB'),
        `${daysOpen} days`,
        isUrgent ? 'YES' : 'NO'
      ]);
    });

    activityLogData.push([]);
    activityLogData.push(['Legend: Issues marked as URGENT (highlighted in yellow) have been open for more than 7 days']);

    const activityLogSheet = XLSX.utils.aoa_to_sheet(activityLogData);

    // Set column widths for activity log sheet
    activityLogSheet['!cols'] = [
      { wch: 10 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 10 }
    ];

    // Apply professional styling to activity log sheet
    // Main header (RRA Green)
    if (activityLogSheet['A1']) {
      activityLogSheet['A1'].s = {
        font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '20603D' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }

    // Subtitle
    if (activityLogSheet['A2']) {
      activityLogSheet['A2'].s = {
        font: { italic: true, sz: 10, color: { rgb: '666666' } },
        alignment: { horizontal: 'center' }
      };
    }

    // Column headers (RRA Green)
    const activityHeaderCells = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4'];
    activityHeaderCells.forEach(cell => {
      if (activityLogSheet[cell]) {
        activityLogSheet[cell].s = {
          font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '20603D' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          }
        };
      }
    });

    // Apply yellow highlighting to urgent issues (>7 days open)
    urgentRows.forEach(rowNum => {
      const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      columns.forEach(col => {
        const cellRef = `${col}${rowNum}`;
        if (activityLogSheet[cellRef]) {
          activityLogSheet[cellRef].s = {
            fill: { fgColor: { rgb: 'FFFF00' } }, // Yellow background
            font: { bold: true },
            alignment: { horizontal: 'left', vertical: 'center' }
          };
        }
      });
    });

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
    XLSX.utils.book_append_sheet(wb, issuesSheet, 'Issues');
    XLSX.utils.book_append_sheet(wb, statisticsSheet, 'Statistics');
    XLSX.utils.book_append_sheet(wb, activityLogSheet, 'Activity Log');

    // Generate filename
    const fileName = currentUser.role === 'ADMIN'
      ? `DQIMS_System_Report_${new Date().toISOString().split('T')[0]}.xlsx`
      : currentUser.role === 'HOD'
      ? `DQIMS_${currentUser.department}_Report_${new Date().toISOString().split('T')[0]}.xlsx`
      : `DQIMS_Personal_Report_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Write the file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">Generate insights and export reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={generatePDF} className="bg-[#20603D] hover:bg-[#1a4d31] h-8">
            <FileText className="w-3 h-3 mr-1" />
            PDF Report
          </Button>
          <Button size="sm" onClick={generateExcel} className="bg-[#20603D] hover:bg-[#1a4d31] h-8">
            <FileSpreadsheet className="w-3 h-3 mr-1" />
            Excel Report
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {currentUser.role === 'ADMIN' && (
              <div>
                <Label className="text-xs">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="mt-1 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Departments</SelectItem>
                    <SelectItem value="VAT">VAT</SelectItem>
                    <SelectItem value="CUSTOMS">Customs</SelectItem>
                    <SelectItem value="DOMESTIC TAX">Domestic Tax</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label className="text-xs">Date Range Mode</Label>
              <Select 
                value={useCustomDateRange ? 'custom' : 'preset'} 
                onValueChange={(v) => setUseCustomDateRange(v === 'custom')}
              >
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preset">Preset Range</SelectItem>
                  <SelectItem value="custom">Custom Date/Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!useCustomDateRange ? (
            <div>
              <Label className="text-xs">Preset Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Start Date/Time</Label>
                <Input
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="mt-1 h-8 text-sm"
                  placeholder="Select start date and time"
                />
              </div>
              <div>
                <Label className="text-xs">End Date/Time</Label>
                <Input
                  type="datetime-local"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  className="mt-1 h-8 text-sm"
                  placeholder="Select end date and time"
                />
              </div>
            </div>
          )}

          {useCustomDateRange && (startDateTime || endDateTime) && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Active Filter:</span>{' '}
                {startDateTime && `From ${new Date(startDateTime).toLocaleString()}`}
                {startDateTime && endDateTime && ' '}
                {endDateTime && `To ${new Date(endDateTime).toLocaleString()}`}
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <p className="text-xs text-gray-600">Total Issues</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{filteredIssues.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">Open</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {filteredIssues.filter((i) => i.status === 'OPEN').length}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {filteredIssues.filter((i) => i.status === 'IN_PROGRESS').length}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {filteredIssues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length}
          </p>
        </Card>
      </div>

      {currentUser.role === 'ADMIN' && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Issues by Department</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={issuesByDepartment}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="open" fill="#EF4444" radius={[4, 4, 0, 0]} name="Open" />
              <Bar dataKey="resolved" fill="#20603D" radius={[4, 4, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={issuesByStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {issuesByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={issuesByPriority}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {issuesByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Issues by Severity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={issuesBySeverity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: '12px' }} />
            <Bar dataKey="value" fill="#00A1DE" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
