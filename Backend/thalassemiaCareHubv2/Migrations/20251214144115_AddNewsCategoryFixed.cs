using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace thalassemiaCareHubv2.Migrations
{
    /// <inheritdoc />
    public partial class AddNewsCategoryFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "NewsPosts",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "NewsPosts");
        }
    }
}
