using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talabat.DAL.Entities.Order
{
    public class Address
    {
        public Address()
        {

        }
        public Address(string firstName, string lastName, string country, string city, string street, string zipCode, string phoneNumber = null, string whatsAppNumber = null)
        {
            FirstName = firstName;
            LastName = lastName;
            Country = country;
            City = city;
            Street = street;
            ZipCode = zipCode;
            PhoneNumber = phoneNumber;
            WhatsAppNumber = whatsAppNumber;
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string ZipCode { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
    }
}
