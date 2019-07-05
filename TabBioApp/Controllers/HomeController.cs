using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using log4net;

namespace TabBioApp.Controllers
{
    public class HomeController : Controller
    {
        private static readonly ILog Logger = LogManager.GetLogger("HomeController");
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            //Logger.Info("Testing information log", (new Exception()));
            //Logger.Debug("Testing Debug log");
            //Logger.Fatal("Testing Fatal log");
            return View();
        }
    }
}
