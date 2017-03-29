using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Data
{
    // static service to test api
    public static class NumberService
    {
        private static List<Number> Numbers = new List<Number>();
        private static int id = 1;

        public static void Initialize()
        {
            Random r = new Random();

            for (int i = 0; i < 5; i++)
            {
                Numbers.Add(new Number { Id = id, Value = r.Next(1, 999) });
                id++;
            }
        }

        public static List<Number> GetAllNumbers()
        {
            return Numbers;
        }

        public static Number GetNumberById(int id)
        {
            return Numbers.SingleOrDefault(x => x.Id == id);
        }

        public static void Add(int value)
        {
            var n = new Number { Id = id, Value = value };
            id++;
            Numbers.Add(n);
        }

        public static void Delete(int id)
        {
            var number = GetNumberById(id);
            Numbers.Remove(number);
        }
    }
}
