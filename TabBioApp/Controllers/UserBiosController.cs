using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
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
using TabBioApp.Models;
using TabBioApp.Providers;

namespace TabBioApp.Controllers
{
    public class UserBiosController : AuthBaseUserController
    {
        public UserBiosController() {

        }

        private tapBioDbEntities db = new tapBioDbEntities();

        // GET: api/UserBios
        public IQueryable<UserBio> GetUserBios()
        {
            return db.UserBios.Where(x => x.Id == LoggedInUserId);
        }

        // GET: api/UserBios/5
        [ResponseType(typeof(UserBio))]
        public async Task<IHttpActionResult> GetUserBio(string id)
        {
            UserBio userBio = await db.UserBios.FindAsync(id);
            if (userBio == null)
            {
                return NotFound();
            }

            return Ok(userBio);
        }

        // PUT: api/UserBios/5
        [ResponseType(typeof(UserBio)), HttpPost, ActionName("AddUpdateUserBio")]
        public async Task<IHttpActionResult> AddUpdateUserBio(UserBio userBio)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //if (id != userBio.Id)
            //{
            //    return BadRequest();
            //}

            bool isEdit = false;

            //userBio.Id = this.LoggedInUserId;

            if (this.LoggedInUserId != userBio.Id)
            {
                return BadRequest();
            }

            if (this.LoggedInAspNetUser.UserBio == null)
            {
                //ModelState.AddModelError("UserBioNotFound", "No record found to be updated");
                //return BadRequest(ModelState);
                isEdit = false;
                db.UserBios.Add(userBio);
            }

            if (this.LoggedInAspNetUser.UserBio != null)
            {
                isEdit = true;
                db.Entry(userBio).State = EntityState.Modified;
            }

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Logger.Error(ex);
                throw;
            }
            catch (DbUpdateException dbex)
            {
                Logger.Error(dbex);

                if (UserBioExists(userBio.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            if (!isEdit)
            {
                return CreatedAtRoute("DefaultApi", new { id = userBio.Id }, userBio);
            }

            db.Dispose();

            HttpResponseMessage Updateresponse = new HttpResponseMessage(HttpStatusCode.OK);
            Updateresponse.Content = new StringContent("Record Updated Successfully");
            return Ok("Record Updated Successfully");


        }

        // POST: api/UserBios
        [ResponseType(typeof(UserBio)), Route("PostUserBio"), ActionName("PostUserBio")]
        public async Task<IHttpActionResult> PostUserBio(UserBio userBio)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //userBio.AspNetUser = this.LoggedInAspNetUser;
            userBio.Id = this.LoggedInUserId;

            db.UserBios.Add(userBio);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException dbex)
            {
                Logger.Error(dbex);

                if (UserBioExists(userBio.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = userBio.Id }, userBio);
        }

        // DELETE: api/UserBios/5
        [ResponseType(typeof(UserBio))]
        public async Task<IHttpActionResult> DeleteUserBio(string id)
        {
            UserBio userBio = await db.UserBios.FindAsync(id);
            if (userBio == null)
            {
                return NotFound();
            }

            if (userBio.AspNetUser.Id != this.LoggedInUserId) {
                ModelState.AddModelError("Invalide Access", "You do not have permission to delete this record");
                return BadRequest(ModelState);
            }

            db.UserBios.Remove(userBio);
            await db.SaveChangesAsync();

            return Ok(userBio);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserBioExists(string id)
        {
            return db.UserBios.Count(e => e.Id == id) > 0;
        }
    }
}