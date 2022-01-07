using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using SignalRMessenger.Data;
using SignalRMessenger.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRMessenger.Hubs
{
    public class ChatHub : Hub
    {
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IHttpContextAccessor _httpContext;

        public ChatHub(AppDbContext context,
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _httpContext = httpContextAccessor;
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendPrivateMessage(string recieverId, string message)
        {
            IdentityUser loggedInUser = await _userManager.GetUserAsync(_httpContext.HttpContext.User);
            await Clients.User(recieverId).SendAsync("ReceiveMessage", loggedInUser.UserName, message);

            Message newMessage = new Message()
            {
                Text = message,
                RecieverId = recieverId,
                SenderId = loggedInUser.Id,
                CreatedDate = DateTime.Now
            };

            _context.Messages.Add(newMessage);
            _context.SaveChanges();
        }

        public async Task Typing(string recieverId)
        {
            await Clients.User(recieverId).SendAsync("ShowTyping");
        }

        public async Task HideTyping(string recieverId)
        {
            await Clients.User(recieverId).SendAsync("HideTyping");
        }

        //public override Task OnConnectedAsync()
        //{
        //    return base.OnConnectedAsync();
        //}

        //public override Task OnDisconnectedAsync(Exception exception)
        //{
        //    return base.OnDisconnectedAsync(exception);
        //}
    }
}
