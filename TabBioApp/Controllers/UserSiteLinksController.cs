using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using TabBioApp;

namespace TabBioApp.Controllers
{
    public class UserSiteLinksController : AuthBaseUserController
    {
        private tapBioDbEntities db = new tapBioDbEntities();

        // GET: api/UserSiteLinks
        public IQueryable<UserSiteLink> GetUserSiteLinks()
        {
            return db.UserSiteLinks.Where(x => x.userId == LoggedInUserId);
        }

        // GET: api/UserSiteLinks/5
        [ResponseType(typeof(UserSiteLink))]
        public async Task<IHttpActionResult> GetUserSiteLink(long id)
        {
            UserSiteLink userSiteLink = await db.UserSiteLinks.FindAsync(id);
            if (userSiteLink == null)
            {
                return NotFound();
            }

            return Ok(userSiteLink);
        }

        // PUT: api/UserSiteLinks/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUserSiteLink(long id, UserSiteLink userSiteLink)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userSiteLink.Id)
            {
                return BadRequest();
            }

            db.Entry(userSiteLink).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSiteLinkExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/UserSiteLinks
        [ResponseType(typeof(UserSiteLink))]
        public async Task<IHttpActionResult> PostMultipleUserSiteLink(List<UserSiteLink> userSiteLink)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserSiteLinks.AddRange(userSiteLink);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                Logger.Error(ex.Message, ex);

                throw;

            }

            return CreatedAtRoute("DefaultApi", null, userSiteLink);
        }

        // DELETE: api/UserSiteLinks/5
        [ResponseType(typeof(UserSiteLink))]
        public async Task<IHttpActionResult> DeleteUserSiteLink(long id)
        {
            UserSiteLink userSiteLink = await db.UserSiteLinks.FindAsync(id);
            if (userSiteLink == null)
            {
                return NotFound();
            }

            if (userSiteLink.userId != LoggedInUserId) {

                ModelState.AddModelError("InvalidAccess","You do not have permission to delete this record");
                return BadRequest(ModelState);
            }

            db.UserSiteLinks.Remove(userSiteLink);
            await db.SaveChangesAsync();

            return Ok(userSiteLink);
        }

        // DELETE: api/UserSiteLinks/5
        [ResponseType(typeof(UserSiteLink))]
        public async Task<IHttpActionResult> DeleteMultipleUserSiteLink(List<long> idLst, string UserId)
        {
            List<UserSiteLink> userSiteLink = db.UserSiteLinks.Where(x=> idLst.Contains(x.Id)).ToList();
            if (userSiteLink == null)
            {
                return NotFound();
            }

            if (UserId != LoggedInUserId) {
                ModelState.AddModelError("InvalidAccess", "You do not have permission to delete this record");
                return BadRequest(ModelState);
            }

            db.UserSiteLinks.RemoveRange(userSiteLink);
            await db.SaveChangesAsync();

            return Ok(userSiteLink);
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserSiteLinkExists(long id)
        {
            return db.UserSiteLinks.Count(e => e.Id == id) > 0;
        }
    }
}