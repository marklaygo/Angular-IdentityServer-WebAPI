using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using IdentityServer4.Services;
using IdentityServer.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using IdentityServer.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.Identity;

namespace IdentityServer
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // add db context
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // configure identity password requirement
            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 4;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
            });

            // add identity
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // add cors
            services.AddCors(options =>
            {
                options.AddPolicy("devCors",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());

                options.AddPolicy("prodCors",
                    builder => builder.WithOrigins(
                        "https://angular-d1.azurewebsites.net",
                        "https://webapi-d1.azurewebsites.net")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            // add mvc
            services.AddMvc();

            // dependency injection
            services.AddTransient<IProfileService, IdentityProfileService>();

            // add identityserver4
            services.AddIdentityServer()
                .AddTemporarySigningCredential()
                .AddInMemoryIdentityResources(Config.GetIdentityResources())
                .AddInMemoryApiResources(Config.GetApiResources())
                .AddInMemoryClients(Config.GetClients())
                .AddAspNetIdentity<ApplicationUser>()
                .AddProfileService<IdentityProfileService>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseIdentityServerAuthentication(new IdentityServerAuthenticationOptions
                {
                    Authority = "http://localhost:5000",
                    RequireHttpsMetadata = false,
                    ApiName = "accountApi"
                });
                app.UseCors("devCors");
            }
            else
            {
                var options = new RewriteOptions().AddRedirectToHttps(302); // redirect to https
                app.UseRewriter(options);

                app.UseIdentityServerAuthentication(new IdentityServerAuthenticationOptions
                {
                    Authority = "https://identityserver-d1.azurewebsites.net",
                    RequireHttpsMetadata = false,
                    ApiName = "accountApi"
                });
                app.UseCors("prodCors");
            }

            app.UseIdentity();
            app.UseIdentityServer();
            app.UseMvc();

            // quick way to apply migration and test user
            try
            {
                var context = app.ApplicationServices.GetService<ApplicationDbContext>();

                // apply migration
                context.Database.Migrate();

                // delete all users
                context.Users.RemoveRange(context.Users.ToList());
                context.SaveChanges();

                // add test user
                var user = new ApplicationUser()
                {
                    UserName = "test@test.com",
                    NormalizedUserName = "TEST@TEST.COM",
                    Email = "test@test.com",
                    NormalizedEmail = "TEST@TEST.COM",
                    EmailConfirmed = true,
                    LockoutEnabled = false,
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                if (!context.Users.Any(u => u.UserName == user.UserName))
                {
                    var passwordHasher = new PasswordHasher<ApplicationUser>();
                    var hashed = passwordHasher.HashPassword(user, "11234");
                    user.PasswordHash = hashed;
                    var userStore = new UserStore<ApplicationUser>(context);
                    userStore.CreateAsync(user);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
