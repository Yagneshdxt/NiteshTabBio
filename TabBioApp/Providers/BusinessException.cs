using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TabBioApp.Providers
{
    public class BusinessException : Exception
    {
        public BusinessException(string ExecptionMessage)
        : base(String.Format("Error Occured: {0}", ExecptionMessage))
        {

        }
    }
}