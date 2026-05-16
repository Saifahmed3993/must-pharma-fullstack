import json

products = [
  {"Name": "Gold Standard 100% Whey", "Price": 1850.0, "Type": 1, "Brand": 1, "Img": "whey_protein"},
  {"Name": "NitroTech Whey Gold", "Price": 1750.0, "Type": 1, "Brand": 2, "Img": "whey_protein"},
  {"Name": "ISO100 Hydrolyzed", "Price": 2200.0, "Type": 1, "Brand": 3, "Img": "whey_protein"},
  {"Name": "Syntha-6 Edge", "Price": 1600.0, "Type": 1, "Brand": 4, "Img": "whey_protein"},
  {"Name": "Micronized Creatine Powder", "Price": 650.0, "Type": 2, "Brand": 1, "Img": "creatine"},
  {"Name": "Cell-Tech Creatine", "Price": 850.0, "Type": 2, "Brand": 2, "Img": "creatine"},
  {"Name": "COR-Performance Creatine", "Price": 600.0, "Type": 2, "Brand": 5, "Img": "creatine"},
  {"Name": "Serious Mass", "Price": 2100.0, "Type": 3, "Brand": 1, "Img": "mass_gainer"},
  {"Name": "Mass-Tech Extreme 2000", "Price": 2300.0, "Type": 3, "Brand": 2, "Img": "mass_gainer"},
  {"Name": "Super Mass Gainer", "Price": 1950.0, "Type": 3, "Brand": 3, "Img": "mass_gainer"},
  {"Name": "Gold Standard Pre-Workout", "Price": 950.0, "Type": 4, "Brand": 1, "Img": "pre_workout"},
  {"Name": "C4 Original", "Price": 850.0, "Type": 4, "Brand": 5, "Img": "pre_workout"},
  {"Name": "N.O.-Xplode", "Price": 900.0, "Type": 4, "Brand": 4, "Img": "pre_workout"},
  {"Name": "Amino Energy", "Price": 750.0, "Type": 5, "Brand": 1, "Img": "bcaa"},
  {"Name": "XTEND Original BCAA", "Price": 800.0, "Type": 5, "Brand": 5, "Img": "bcaa"},
  {"Name": "Platinum Multivitamin", "Price": 550.0, "Type": 6, "Brand": 2, "Img": "vitamins"},
  {"Name": "Opti-Men", "Price": 680.0, "Type": 6, "Brand": 1, "Img": "vitamins"},
  {"Name": "Kevin Levrone Gold Creatine", "Price": 700.0, "Type": 2, "Brand": 6, "Img": "creatine"},
  {"Name": "Gold Standard 100% Casein", "Price": 1950.0, "Type": 1, "Brand": 1, "Img": "whey_protein"},
  {"Name": "Platinum HydroWhey", "Price": 2400.0, "Type": 1, "Brand": 1, "Img": "whey_protein"},
  {"Name": "Pro Gainer", "Price": 2050.0, "Type": 3, "Brand": 1, "Img": "mass_gainer"},
  {"Name": "Opti-Women", "Price": 650.0, "Type": 6, "Brand": 1, "Img": "vitamins"},
  {"Name": "Fish Oil Softgels", "Price": 450.0, "Type": 6, "Brand": 1, "Img": "vitamins"},
  {"Name": "Glutamine Powder", "Price": 500.0, "Type": 5, "Brand": 1, "Img": "bcaa"},
  {"Name": "ZMA", "Price": 400.0, "Type": 6, "Brand": 1, "Img": "vitamins"},
  {"Name": "Gold Standard Plant Protein", "Price": 1650.0, "Type": 1, "Brand": 1, "Img": "whey_protein"},
  {"Name": "Gold Standard Isolate", "Price": 2150.0, "Type": 1, "Brand": 1, "Img": "whey_protein"},
  {"Name": "Phase8 Protein", "Price": 1600.0, "Type": 1, "Brand": 2, "Img": "whey_protein"},
  {"Name": "Platinum 100% Creatine", "Price": 550.0, "Type": 2, "Brand": 2, "Img": "creatine"},
  {"Name": "VaporX5 Next Gen", "Price": 880.0, "Type": 4, "Brand": 2, "Img": "pre_workout"},
  {"Name": "Amino Build Next Gen", "Price": 780.0, "Type": 5, "Brand": 2, "Img": "bcaa"},
  {"Name": "Clear Muscle", "Price": 1100.0, "Type": 5, "Brand": 2, "Img": "bcaa"},
  {"Name": "Hydroxycut Hardcore Elite", "Price": 900.0, "Type": 6, "Brand": 2, "Img": "vitamins"},
  {"Name": "Nitro-Tech Ripped", "Price": 1850.0, "Type": 1, "Brand": 2, "Img": "whey_protein"},
  {"Name": "Elite 100% Whey", "Price": 1500.0, "Type": 1, "Brand": 3, "Img": "whey_protein"},
  {"Name": "Elite Casein", "Price": 1650.0, "Type": 1, "Brand": 3, "Img": "whey_protein"},
  {"Name": "All9 Amino", "Price": 850.0, "Type": 5, "Brand": 3, "Img": "bcaa"},
  {"Name": "PreW.O.", "Price": 900.0, "Type": 4, "Brand": 3, "Img": "pre_workout"},
  {"Name": "Creatine Micronized", "Price": 620.0, "Type": 2, "Brand": 3, "Img": "creatine"},
  {"Name": "Z-Force", "Price": 450.0, "Type": 6, "Brand": 3, "Img": "vitamins"},
  {"Name": "ISO100 Clear", "Price": 2300.0, "Type": 1, "Brand": 3, "Img": "whey_protein"},
  {"Name": "Syntha-6 Isolate", "Price": 1900.0, "Type": 1, "Brand": 4, "Img": "whey_protein"},
  {"Name": "True Mass 1200", "Price": 2200.0, "Type": 3, "Brand": 4, "Img": "mass_gainer"},
  {"Name": "Amino X", "Price": 700.0, "Type": 5, "Brand": 4, "Img": "bcaa"},
  {"Name": "Cellmass 2.0", "Price": 950.0, "Type": 2, "Brand": 4, "Img": "creatine"},
  {"Name": "Endorush", "Price": 850.0, "Type": 4, "Brand": 4, "Img": "pre_workout"},
  {"Name": "C4 Ripped", "Price": 950.0, "Type": 4, "Brand": 5, "Img": "pre_workout"},
  {"Name": "C4 Ultimate", "Price": 1150.0, "Type": 4, "Brand": 5, "Img": "pre_workout"},
  {"Name": "Alpha Amino", "Price": 820.0, "Type": 5, "Brand": 5, "Img": "bcaa"},
  {"Name": "COR-Performance Whey", "Price": 1550.0, "Type": 1, "Brand": 5, "Img": "whey_protein"},
  {"Name": "SuperHD", "Price": 900.0, "Type": 6, "Brand": 5, "Img": "vitamins"},
  {"Name": "LevroISOWhey", "Price": 1950.0, "Type": 1, "Brand": 6, "Img": "whey_protein"},
  {"Name": "Anabolic Mass", "Price": 2150.0, "Type": 3, "Brand": 6, "Img": "mass_gainer"},
  {"Name": "Shaaboom Pump", "Price": 920.0, "Type": 4, "Brand": 6, "Img": "pre_workout"},
  {"Name": "LevroBCAA", "Price": 750.0, "Type": 5, "Brand": 6, "Img": "bcaa"},
  {"Name": "LevroArmour", "Price": 600.0, "Type": 6, "Brand": 6, "Img": "vitamins"}
]

output = []
for p in products:
    output.append({
        "Name": p["Name"],
        "Description": f"Premium quality {p['Name']} for enhanced performance and recovery. Highly recommended for athletes and bodybuilders.",
        "Price": p["Price"],
        "PictureUrl": f"images/products/{p['Img']}.png",
        "ProductTypeId": p["Type"],
        "ProductBrandId": p["Brand"]
    })

with open('Talabat.DAL/Data/SeedData/products.json', 'w') as f:
    json.dump(output, f, indent=2)

print(f'Wrote {len(output)} products to products.json')
