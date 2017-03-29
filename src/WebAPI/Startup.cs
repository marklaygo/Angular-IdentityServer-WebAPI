using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Rewrite;
using WebAPI.Data;

namespace WebAPI
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // add cors
            services.AddCors(options =>
            {
                options.AddPolicy("devCors",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());

                options.AddPolicy("prodCors",
                    builder => builder.WithOrigins("https://angular-d1.azurewebsites.net")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseIdentityServerAuthentication(new IdentityServerAuthenticationOptions
                {
                    Authority = "http://localhost:5000",
                    RequireHttpsMetadata = false,
                    ApiName = "api1"
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
                    ApiName = "api1"
                });
                app.UseCors("prodCors");
            }

            app.UseMvc();

            NumberService.Initialize();
        }
    }
}
