using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using XlsxGanttChartWeb.Models;

namespace XlsxGanttChartWeb.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public IActionResult SaveXlsx(ProjectXmlForm form)
        {
            var excelBytes = ProjectManagementXlsx.Adapter.GetExcelBytes(form.ProjectXml);
            return Ok(new { data = Convert.ToBase64String(excelBytes) });
        }

        [HttpPost]
        public IActionResult LoadXlsx(IFormFile file)
        {
            using (var stream = file.OpenReadStream()) {
                byte[] excelBytes = new byte[file.Length];
                stream.Read(excelBytes, 0, excelBytes.Length);
                var projectXml = ProjectManagementXlsx.Adapter.GetProjectXml(excelBytes);
                return Ok(new { data = projectXml });
            }
        }
    }

    public class ProjectXmlForm
    {
        public string ProjectXml { get; set; }
    }
}
