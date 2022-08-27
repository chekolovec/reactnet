var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

builder.Services.AddControllersWithViews();

var app = builder.Build();
startup.Configure(app, builder.Environment);

