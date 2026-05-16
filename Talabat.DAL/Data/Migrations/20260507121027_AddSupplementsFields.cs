using Microsoft.EntityFrameworkCore.Migrations;

namespace Talabat.DAL.Data.Migrations
{
    public partial class AddSupplementsFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Flavor",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Flavor",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "Products");
        }
    }
}
