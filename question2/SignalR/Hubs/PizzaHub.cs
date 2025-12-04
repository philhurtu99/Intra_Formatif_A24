using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    public class PizzaHub : Hub
    {
        private readonly PizzaManager _pizzaManager;

        public PizzaHub(PizzaManager pizzaManager) {
            _pizzaManager = pizzaManager;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            _pizzaManager.AddUser();
            await Clients.All.SendAsync("NbrUsers", _pizzaManager.NbConnectedUsers);
		}

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnConnectedAsync();
            _pizzaManager.RemoveUser();
            await Clients.All.SendAsync("NbrUsers", _pizzaManager.NbConnectedUsers);
		}

        public async Task SelectChoice(PizzaChoice choice)
        {
            string groupeName = _pizzaManager.GetGroupName(choice);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupeName);

            await Clients.Group(groupeName).SendAsync("PrixPizza", _pizzaManager.PIZZA_PRICES[(int)choice]);
		}

        public async Task UnselectChoice(PizzaChoice choice)
        {
			await Groups.RemoveFromGroupAsync(Context.ConnectionId, _pizzaManager.GetGroupName(choice));
		}

        public async Task AddMoney(PizzaChoice choice)
        {
            _pizzaManager.IncreaseMoney(choice);

            string groupeName = _pizzaManager.GetGroupName(choice);

            await Clients.Group(groupeName).SendAsync("UpdateMoney", _pizzaManager.Money[(int)choice]);
		}

        public async Task BuyPizza(PizzaChoice choice)
        {
            _pizzaManager.BuyPizza(choice);
            string groupeName = _pizzaManager.GetGroupName(choice);

			await Clients.Group(groupeName).SendAsync("UpdateNbPizzasAndMoney", _pizzaManager.Money[(int)choice], _pizzaManager.NbPizzas[(int)choice]);
		}
    }
}
