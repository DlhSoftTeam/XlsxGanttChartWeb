// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

var ganttChartView = document.getElementById('ganttChartView');

var date = new Date(), year = date.getFullYear(), month = date.getMonth();
var items = [{ content: 'Task 1', isExpanded: false },
             { content: 'Task 1.1', indentation: 1, start: new Date(year, month, 2, 8, 0, 0), finish: new Date(year, month, 4, 16, 0, 0) },
             { content: 'Task 1.2', indentation: 1, start: new Date(year, month, 3, 8, 0, 0), finish: new Date(year, month, 5, 12, 0, 0) },
             { content: 'Task 2', isExpanded: true },
             { content: 'Task 2.1', indentation: 1, start: new Date(year, month, 2, 8, 0, 0), finish: new Date(year, month, 8, 16, 0, 0), completedFinish: new Date(year, month, 5, 16, 0, 0), assignmentsContent: 'Resource 1, Resource 2 [50%]' },
             { content: 'Task 2.2', indentation: 1 },
             { content: 'Task 2.2.1', indentation: 2, start: new Date(year, month, 11, 8, 0, 0), finish: new Date(year, month, 14, 16, 0, 0), completedFinish: new Date(year, month, 14, 16, 0, 0), assignmentsContent: 'Resource 2' },
             { content: 'Task 2.2.2', indentation: 2, start: new Date(year, month, 12, 12, 0, 0), finish: new Date(year, month, 14, 16, 0, 0), assignmentsContent: 'Resource 2' },
             { content: 'Task 3', indentation: 1, start: new Date(year, month, 15, 16, 0, 0), isMilestone: true }];
items[3].predecessors = [{ item: items[0], dependencyType: 'SS' }];
items[7].predecessors = [{ item: items[6], lag: 2 * 60 * 60 * 1000 }];
items[8].predecessors = [{ item: items[4] }, { item: items[5] }];
for (var i = 4; i <= 16; i++)
    items.push({ content: 'Task ' + i, indentation: i >= 8 && i % 3 == 2 ? 0 : 1, start: new Date(year, month, 2 + (i <= 8 ? (i - 4) * 3 : i - 8), 8, 0, 0), finish: new Date(year, month, 2 + (i <= 8 ? (i - 4) * 3 + (i > 8 ? 6 : 1) : i - 2), 16, 0, 0) });
items[9].finish.setDate(items[9].finish.getDate() + 2);
items[9].assignmentsContent = 'Resource 1';
items[10].predecessors = [{ item: items[9] }];
var settings = {
    currentTime: new Date(year, month, 2, 12, 0, 0)
};
DlhSoft.Controls.GanttChartView.initialize(ganttChartView, items, settings);

function loadXlsx() {
    let data = new FormData();
    var fileInput = document.getElementById('xlsxFileInput');
    let file = fileInput.files[0];
    if (!file) {
        alert('Select a file first.');
        return;
    }
    data.append('file', file);
    fetch('/Home/LoadXlsx', { method: 'POST', body: data }).then(response => response.json()).then(response => {
        var projectXml = response.data;
        var projectSerializer = DlhSoft.Controls.GanttChartView.ProjectSerializer.initialize(ganttChartView);
        projectSerializer.loadXml(projectXml);
    });
}

function saveXlsx() {
    let data = new FormData();
    var projectSerializer = DlhSoft.Controls.GanttChartView.ProjectSerializer.initialize(ganttChartView);
    var projectXml = projectSerializer.getXml();
    data.append('ProjectXml', projectXml);
    fetch('/Home/SaveXlsx', { method: 'POST', body: data }).then(response => response.json()).then(response => {
        var excelBase64 = response.data;
        var dataUrl = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBase64;
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'GanttChart.xlsx';
        a.click();
    });
}