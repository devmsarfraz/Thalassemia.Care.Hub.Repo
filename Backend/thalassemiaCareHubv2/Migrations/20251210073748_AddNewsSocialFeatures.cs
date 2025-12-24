using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace thalassemiaCareHubv2.Migrations
{
    /// <inheritdoc />
    public partial class AddNewsSocialFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NewsComments",
                columns: table => new
                {
                    CommentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NewsPostId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CommentContent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())"),
                    IsDelete = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ParentCommentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsComments", x => x.CommentId);
                    table.ForeignKey(
                        name: "FK_NewsComments_NewsPosts",
                        column: x => x.NewsPostId,
                        principalTable: "NewsPosts",
                        principalColumn: "NewsPostID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NewsComments_ParentComment",
                        column: x => x.ParentCommentId,
                        principalTable: "NewsComments",
                        principalColumn: "CommentId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NewsComments_Users",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NewsLikes",
                columns: table => new
                {
                    LikeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NewsPostId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LikeDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsLikes", x => x.LikeId);
                    table.ForeignKey(
                        name: "FK_NewsLikes_NewsPosts",
                        column: x => x.NewsPostId,
                        principalTable: "NewsPosts",
                        principalColumn: "NewsPostID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NewsLikes_Users",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NewsComments_NewsPostId",
                table: "NewsComments",
                column: "NewsPostId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsComments_ParentCommentId",
                table: "NewsComments",
                column: "ParentCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsComments_UserId",
                table: "NewsComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsLikes_NewsPostId",
                table: "NewsLikes",
                column: "NewsPostId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsLikes_UserId",
                table: "NewsLikes",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NewsComments");

            migrationBuilder.DropTable(
                name: "NewsLikes");
        }
    }
}
