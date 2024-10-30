using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Linq;
using BackendService.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace BackendService.Data
{
    public class DataSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private const int DESIRED_USER_COUNT = 50;

        public DataSeeder(ApplicationDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        public async Task SeedDataAsync()
        {
            // Check current user count
            var currentUserCount = await _context.Users.CountAsync();
            
            // If we already have enough users, return
            if (currentUserCount >= DESIRED_USER_COUNT)
            {
                Console.WriteLine($"Database already has {currentUserCount} users. No additional seeding needed.");
                return;
            }

            // Calculate how many more users we need
            var usersToAdd = DESIRED_USER_COUNT - currentUserCount;
            
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                // Request slightly more users than needed in case some data is invalid
                var response = await httpClient.GetStringAsync($"https://randomuser.me/api/?results={usersToAdd + 10}");

                var randomUserResponse = JsonConvert.DeserializeObject<RandomUserApiResponse>(response);

                if (randomUserResponse?.results != null)
                {
                    var newUsers = randomUserResponse.results
                        .Take(usersToAdd)
                        .Select(userData => new User
                        {
                            Uuid = Guid.NewGuid(),
                            FirstName = userData.name.first,
                            LastName = userData.name.last,
                            Email = userData.email,
                            Phone = userData.phone,
                            ThumbnailPicture = userData.picture.thumbnail,
                            LargePicture = userData.picture.large,
                            StreetNumber = userData.location.street.number.ToString(),
                            StreetName = userData.location.street.name,
                            City = userData.location.city,
                            State = userData.location.state,
                            Country = userData.location.country,
                            Postcode = userData.location.postcode?.ToString() ?? "00000"
                        })
                        .ToList();

                    await _context.Users.AddRangeAsync(newUsers);
                    await _context.SaveChangesAsync();

                    var finalUserCount = await _context.Users.CountAsync();
                    Console.WriteLine($"Successfully seeded database. Current user count: {finalUserCount}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error seeding users: {ex.Message}");
                throw;
            }
        }
    }
}