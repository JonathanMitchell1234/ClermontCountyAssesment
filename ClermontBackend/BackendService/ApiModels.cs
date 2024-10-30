using System;
using System.Collections.Generic;

namespace BackendService.Models
{
    // Root object representing the entire API response
    public class RandomUserApiResponse
    {
        public List<Result> results { get; set; }
        public Info info { get; set; }
    }

    // User details
    public class Result
    {
        public string gender { get; set; }
        public Name name { get; set; }
        public Location location { get; set; }
        public string email { get; set; }
        public Login login { get; set; }
        public Dob dob { get; set; }
        public Registered registered { get; set; }
        public string phone { get; set; }
        public string cell { get; set; }
        public Id id { get; set; }
        public Picture picture { get; set; }
        public string nat { get; set; }
    }

    // Other supporting classes
    public class Name { public string title { get; set; } public string first { get; set; } public string last { get; set; } }
    public class Street { public int number { get; set; } public string name { get; set; } }
    public class Location { public Street street { get; set; } public string city { get; set; } public string state { get; set; } public string country { get; set; } public object postcode { get; set; } }
    public class Login { public string uuid { get; set; } /* Other properties */ }
    public class Dob { public DateTime date { get; set; } public int age { get; set; } }
    public class Registered { /* Properties */ }
    public class Id { /* Properties */ }
    public class Picture { public string large { get; set; } public string medium { get; set; } public string thumbnail { get; set; } }
    public class Info { public string seed { get; set; } public int results { get; set; } public int page { get; set; } public string version { get; set; } }
}
