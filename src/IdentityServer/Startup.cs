using System;
using System.Linq;
using IdentityServer.Data;
using IdentityServer.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace IdentityServer
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IHostingEnvironment Environment { get; }

        public Startup(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // add db context
            services.AddDbContext<ApplicationDbContext>(options =>
                //options.UseInMemoryDatabase(databaseName: "IdentityServer4"));
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // add identity
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // configure password requirements
            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 4;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
            });

            // add mvc  
            services.AddMvcCore()
                .AddAuthorization()
                .AddJsonFormatters();

            // dependency injection
            services.AddTransient<IProfileService, IdentityProfileService>();

            // add identityserver4
            var builder = services.AddIdentityServer()
                .AddInMemoryIdentityResources(Config.GetIdentityResources())
                .AddInMemoryApiResources(Config.GetApis())
                .AddInMemoryClients(Config.GetClients())
                //.AddTestUsers(Config.GetUsers())
                .AddAspNetIdentity<ApplicationUser>()
                .AddProfileService<IdentityProfileService>();


            services.AddAuthentication("Bearer")
                .AddJwtBearer("Bearer", options =>
                {
                    options.Authority = "http://localhost:5000";
                    options.RequireHttpsMetadata = false;
                    options.Audience = "accountApi";
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ClockSkew = TimeSpan.FromMinutes(0)
                    };
                });

            // add cors
            services.AddCors(options =>
            {
                // this defines a CORS policy called "default"
                options.AddPolicy("default", policy =>
                {
                    policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            if (Environment.IsDevelopment())
            {
                builder.AddDeveloperSigningCredential();
            }
            else
            {
                throw new Exception("need to configure key material");
            }
        }

        public void Configure(IApplicationBuilder app, ApplicationDbContext context)
        {
            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("default");
            app.UseIdentityServer();
            app.UseAuthentication();
            app.UseMvc();

            // quick way to apply migration and test user
            try
            {
                //var context = app.ApplicationServices.GetService<ApplicationDbContext>();

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