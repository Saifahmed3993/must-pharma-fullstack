using Microsoft.EntityFrameworkCore.Migrations;

namespace Talabat.DAL.Data.Migrations
{
    public partial class AddPhoneNumbersToStore : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ShipToAddress_PhoneNumber",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShipToAddress_WhatsAppNumber",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShipToAddress_PhoneNumber",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ShipToAddress_WhatsAppNumber",
                table: "Orders");
        }
    }
}
