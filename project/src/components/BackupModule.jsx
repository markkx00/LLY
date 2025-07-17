import React, { useState } from 'react';

const BackupModule = ({ employees, onImportData }) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  const handleExport = async () => {
    setExporting(true);
    try {
      // Prepare data for export
      const exportData = employees.map(employee => {
        const skillsData = {};
        employee.skills.forEach(skill => {
          skillsData[`Skill ${employee.skills.indexOf(skill) + 1} - ${skill.name}`] = skill.score;
        });
        
        return {
          'Employee ID': employee.employeeId,
          'Name': employee.name,
          'Email': employee.email,
          'Position': employee.position,
          'Department': employee.department,
          'Phone': employee.phone,
          'Start Date': employee.startDate,
          'Manager': employee.manager,
          'Attendance Rate': employee.attendanceRate,
          'Tasks Completed': employee.tasksCompleted,
          'Events Joined': employee.eventsJoined,
          'Status': employee.status,
          ...skillsData,
          'Rewards': employee.rewards || ''
        };
      });

      // Convert to CSV format
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `employee_data_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setImportStatus('✅ Data exported successfully!');
      setTimeout(() => setImportStatus(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setImportStatus('❌ Export failed. Please try again.');
      setTimeout(() => setImportStatus(''), 3000);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    setImportStatus('📤 Processing file...');

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const importedData = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const employee = {};
        
        headers.forEach((header, index) => {
          employee[header] = values[index];
        });
        
        // Convert to proper employee format
        const formattedEmployee = {
          id: employee['Employee ID'], // Use Employee ID as document ID
          employeeId: employee['Employee ID'],
          name: employee['Name'],
          email: employee['Email'],
          position: employee['Position'],
          department: employee['Department'],
          phone: employee['Phone'],
          startDate: employee['Start Date'],
          manager: employee['Manager'],
          attendanceRate: parseInt(employee['Attendance Rate']) || 95,
          tasksCompleted: parseInt(employee['Tasks Completed']) || 0,
          eventsJoined: parseInt(employee['Events Joined']) || 0,
          status: employee['Status'] || 'active',
          skills: [
            { name: 'ทดสอบ Munsell', score: parseInt(employee['Skill 1 - ทดสอบ Munsell']) || 50 },
            { name: 'การต่อเทปร้อยเทป', score: parseInt(employee['Skill 2 - การต่อเทปร้อยเทป']) || 50 },
            { name: 'การเตรียมสีและสารเคมี', score: parseInt(employee['Skill 3 - การเตรียมสีและสารเคมี']) || 50 },
            { name: 'การอ่านใบย้อม', score: parseInt(employee['Skill 4 - การอ่านใบย้อม']) || 50 },
            { name: 'การตรวจคุณภาพงานย้อม', score: parseInt(employee['Skill 5 - การตรวจคุณภาพงานย้อม']) || 50 },
            { name: 'การตรวจเช็คเครื่องจักร', score: parseInt(employee['Skill 6 - การตรวจเช็คเครื่องจักร']) || 50 },
            { name: 'ทักษะการดูสี / เติมสี / ปรับสี', score: parseInt(employee['Skill 7 - ทักษะการดูสี / เติมสี / ปรับสี']) || 50 }
          ],
          rewards: employee['Rewards'] || ''
        };
        
        importedData.push(formattedEmployee);
      }

      // Use the onImportData callback to handle the import
      if (onImportData) {
        await onImportData(importedData);
      }

      setImportStatus(`✅ Successfully imported ${importedData.length} employee records!`);
      setTimeout(() => setImportStatus(''), 5000);
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('❌ Import failed. Please check your file format.');
      setTimeout(() => setImportStatus(''), 5000);
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Employee ID': 'EMP001',
        'Name': 'John Doe',
        'Email': 'john.doe@company.com',
        'Position': 'Software Developer',
        'Department': 'Engineering',
        'Phone': '+1 (555) 123-4567',
        'Start Date': '2023-01-15',
        'Manager': 'Jane Smith',
        'Attendance Rate': '95',
        'Tasks Completed': '24',
        'Events Joined': '12',
        'Status': 'active',
        'Skill 1 - ทดสอบ Munsell': '85',
        'Skill 2 - การต่อเทปร้อยเทป': '72',
        'Skill 3 - การเตรียมสีและสารเคมี': '68',
        'Skill 4 - การอ่านใบย้อม': '90',
        'Skill 5 - การตรวจคุณภาพงานย้อม': '88',
        'Skill 6 - การตรวจเช็คเครื่องจักร': '75',
        'Skill 7 - ทักษะการดูสี / เติมสี / ปรับสี': '82',
        'Rewards': 'Employee of the Month, Perfect Attendance'
      },
      {
        'Employee ID': 'EMP002',
        'Name': 'Jane Smith',
        'Email': 'jane.smith@company.com',
        'Position': 'Quality Manager',
        'Department': 'Quality Control',
        'Phone': '+1 (555) 234-5678',
        'Start Date': '2022-08-10',
        'Manager': 'Mike Johnson',
        'Attendance Rate': '98',
        'Tasks Completed': '32',
        'Events Joined': '18',
        'Status': 'active',
        'Skill 1 - ทดสอบ Munsell': '92',
        'Skill 2 - การต่อเทปร้อยเทป': '88',
        'Skill 3 - การเตรียมสีและสารเคมี': '85',
        'Skill 4 - การอ่านใบย้อม': '95',
        'Skill 5 - การตรวจคุณภาพงานย้อม': '90',
        'Skill 6 - การตรวจเช็คเครื่องจักร': '78',
        'Skill 7 - ทักษะการดูสี / เติมสี / ปรับสี': '87',
        'Rewards': 'Team Leader Award, Innovation Prize'
      }
    ];

    const headers = Object.keys(templateData[0]);
    const csvContent = [
      headers.join(','),
      ...templateData.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_data_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Backup & Data Management</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Export and import employee data including skill scores
          </p>
        </div>
      </div>

      {/* Status Message */}
      {importStatus && (
        <div className="card" style={{ 
          marginBottom: '2rem', 
          background: importStatus.includes('❌') ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${importStatus.includes('❌') ? '#fecaca' : '#bbf7d0'}`
        }}>
          <div style={{ 
            color: importStatus.includes('❌') ? '#dc2626' : '#16a34a',
            fontWeight: 500,
            textAlign: 'center',
            padding: '0.5rem'
          }}>
            {importStatus}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Export Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📤 Export Data</h3>
            <div className="card-icon green">💾</div>
          </div>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                Download all employee data including skill scores in CSV format for backup or external analysis.
              </p>
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '0.875rem', fontWeight: 600 }}>
                  Export includes:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                  <li>Employee basic information</li>
                  <li>All 7 skill scores</li>
                  <li>Performance metrics</li>
                  <li>Activity participation data</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                background: exporting ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                cursor: exporting ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {exporting ? (
                <>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Exporting...
                </>
              ) : (
                <>
                  📥 Export Employee Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📥 Import Data</h3>
            <div className="card-icon blue">📊</div>
          </div>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                Upload a CSV file to bulk update employee data and skill scores. Use the template for proper formatting.
              </p>
              <div style={{ 
                background: '#fef3c7', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                border: '1px solid #fbbf24',
                marginBottom: '1rem'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e', fontSize: '0.875rem', fontWeight: 600 }}>
                  ⚠️ Important Notes:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e', fontSize: '0.875rem' }}>
                  <li>Download template first for correct format</li>
                  <li>Skill scores must be 0-100</li>
                  <li>This will update existing employees</li>
                  <li>Backup current data before importing</li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <button
                onClick={downloadTemplate}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                📋 Download Template
              </button>

              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleImport}
                  disabled={importing}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    cursor: importing ? 'not-allowed' : 'pointer'
                  }}
                />
                <button
                  disabled={importing}
                  style={{
                    background: importing ? '#9ca3af' : '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '0.5rem',
                    cursor: importing ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '1rem',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {importing ? (
                    <>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      📤 Choose File to Import
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Data Overview */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">📊 Current Data Overview</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ 
            background: '#eff6ff', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1e40af' }}>
              {employees.length}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Total Employees
            </div>
          </div>
          
          <div style={{ 
            background: '#f0fdf4', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#16a34a' }}>
              {employees.filter(emp => emp.status === 'active').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Active Employees
            </div>
          </div>
          
          <div style={{ 
            background: '#fefce8', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ca8a04' }}>
              7
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Skill Categories
            </div>
          </div>
          
          <div style={{ 
            background: '#fdf2f8', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#be185d' }}>
              {new Date().toLocaleDateString()}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Last Updated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupModule;