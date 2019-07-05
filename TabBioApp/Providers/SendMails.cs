using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Web;
using log4net;
using log4net.Config;

namespace TabBioApp.Providers
{
    public class SendMails
    {
        private static readonly ILog Logger = LogManager.GetLogger("SendMail");

        public bool SendEmail(string toAddress, string subject, string body, bool IsBodyHtml, string MsgFrom)
        {
            bool DisableMail = Convert.ToBoolean(ConfigurationManager.AppSettings["DisableMail"]);
            if (DisableMail)
            {
                return true;
            }

            bool result = true;
            string senderID = Convert.ToString(ConfigurationManager.AppSettings["SmtpUserID"]);
            string senderPassword = Convert.ToString(ConfigurationManager.AppSettings["SmtpUserPassword"]);
            string Host = Convert.ToString(ConfigurationManager.AppSettings["SmtpHost"]);
            int Port = Convert.ToInt32(ConfigurationManager.AppSettings["SmtpPort"]);
            bool IsSslEnable = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);
            MsgFrom = String.IsNullOrEmpty(MsgFrom) ? ConfigurationManager.AppSettings["MailFrom"] : MsgFrom;
            try
            {
                SmtpClient smtp = new System.Net.Mail.SmtpClient
                {
                    Host = Host,
                    Port = Port,
                    EnableSsl = IsSslEnable,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new System.Net.NetworkCredential(senderID, senderPassword),
                    Timeout = 30000,
                };
                using (MailMessage message = new MailMessage(senderID, toAddress, subject, body))
                {
                    message.From = new MailAddress(senderID, MsgFrom);
                    message.IsBodyHtml = IsBodyHtml;
                    //message.Attachments.Add(new Attachment(fileUploader.PostedFile.InputStream, fileName));
                    //message.Attachments.Add(new MailAttachment(Server.MapPath(strFileName)););
                    smtp.Send(message);
                    smtp.Dispose();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message, ex);
                result = false;
            }
            return result;
        }

        public bool SendEmailWithAttachment(string toAddress, string subject, string body, bool IsBodyHtml, string MsgFrom, string[] AttachmentFiles)
        {

            bool DisableMail = Convert.ToBoolean(ConfigurationManager.AppSettings["DisableMail"]);
            if (DisableMail)
            {
                return true;
            }

            bool result = true;
            string senderID = Convert.ToString(ConfigurationManager.AppSettings["SmtpUserID"]);
            string senderPassword = Convert.ToString(ConfigurationManager.AppSettings["SmtpUserPassword"]);
            string Host = Convert.ToString(ConfigurationManager.AppSettings["SmtpHost"]);
            int Port = Convert.ToInt32(ConfigurationManager.AppSettings["SmtpPort"]);
            bool IsSslEnable = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);
            MsgFrom = String.IsNullOrEmpty(MsgFrom) ? ConfigurationManager.AppSettings["MailFrom"] : MsgFrom;
            try
            {
                SmtpClient smtp = new System.Net.Mail.SmtpClient
                {
                    Host = Host,
                    Port = Port,
                    EnableSsl = IsSslEnable,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new System.Net.NetworkCredential(senderID, senderPassword),
                    Timeout = 30000,
                };
                using (MailMessage message = new MailMessage(senderID, toAddress, subject, body))
                {
                    message.From = new MailAddress(senderID, MsgFrom);
                    message.IsBodyHtml = IsBodyHtml;

                    if (AttachmentFiles != null)
                    {
                        System.Net.Mail.Attachment attachment;
                        foreach (var attachMent in AttachmentFiles)
                        {
                            attachment = new System.Net.Mail.Attachment(attachMent);
                            message.Attachments.Add(attachment);
                            attachment.Dispose();
                        }
                    }
                    smtp.Send(message);
                    smtp.Dispose();
                }
            }
            catch (Exception ex)
            {
                //Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                Logger.Error(ex.Message, ex);
                result = false;
            }
            return result;
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~SendMails() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion
    }
}