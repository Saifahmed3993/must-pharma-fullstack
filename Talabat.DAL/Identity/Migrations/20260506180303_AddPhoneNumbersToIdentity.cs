using Microsoft.EntityFrameworkCore.Migrations;

namespace Talabat.DAL.Identity.Migrations
{
    public partial class AddPhoneNumbersToIdentity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Address",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhatsAppNumber",
                table: "Address",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "WhatsAppNumber",
                table: "Address");
        }
    }
}
