using IdentityModel;
using IdentityServer.Models;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IdentityServer
{
    public class IdentityProfileService : IProfileService
    {
        #region Fields 

        private readonly IUserClaimsPrincipalFactory<ApplicationUser> _claimsFactory;
        private readonly UserManager<ApplicationUser> _userManager;

        #endregion

        #region Constructor

        public IdentityProfileService(
            IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory,
            UserManager<ApplicationUser> userManager)
        {
            _claimsFactory = claimsFactory;
            _userManager = userManager;
        }

        #endregion

        #region Method

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var subjectId = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(subjectId);
            var principal = await _claimsFactory.CreateAsync(user);
            var claims = principal.Claims.ToList();

            // test role
            claims.Add(new Claim(JwtClaimTypes.Role, "test_role"));

            context.IssuedClaims = claims;
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var subjectId = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(subjectId);
            context.IsActive = user != null;
        }

        #endregion
    }
}
