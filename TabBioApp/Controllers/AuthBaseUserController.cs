using log4net;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TabBioApp.Models;
using TabBioApp.Providers;

namespace TabBioApp.Controllers
{
    [Authorize, ExceptionHandling]
    public class AuthBaseUserController : ApiController
    {
        public static readonly ILog Logger = LogManager.GetLogger("AuthBaseUserController");
        private tapBioDbEntities db = new tapBioDbEntities();
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public AspNetUser LoggedInAspNetUser {

            get
            {
                return db.AspNetUsers.Find(LoggedInUserId);
            }
        }

        public ApplicationUser LoggedInUser
        {
            get
            {
                return UserManager.FindById(LoggedInUserId);  
            }
        }

        public string LoggedInUserId
        {
            get
            {
                return User.Identity.GetUserId();
            }
        }

    }
}
