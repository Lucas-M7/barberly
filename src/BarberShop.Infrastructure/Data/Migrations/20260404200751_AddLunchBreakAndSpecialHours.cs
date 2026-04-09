using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BarberShop.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLunchBreakAndSpecialHours : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "has_lunch_break",
                table: "working_hours",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "lunch_end",
                table: "working_hours",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "lunch_start",
                table: "working_hours",
                type: "time",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "special_hours",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    barber_profile_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    is_open = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    start_time = table.Column<TimeOnly>(type: "time", nullable: false),
                    end_time = table.Column<TimeOnly>(type: "time", nullable: false),
                    has_lunch_break = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    lunch_start = table.Column<TimeOnly>(type: "time", nullable: true),
                    lunch_end = table.Column<TimeOnly>(type: "time", nullable: true),
                    reason = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_special_hours", x => x.id);
                    table.ForeignKey(
                        name: "FK_special_hours_barber_profiles_barber_profile_id",
                        column: x => x.barber_profile_id,
                        principalTable: "barber_profiles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_special_hours_barber_profile_id_date",
                table: "special_hours",
                columns: new[] { "barber_profile_id", "date" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "special_hours");

            migrationBuilder.DropColumn(
                name: "has_lunch_break",
                table: "working_hours");

            migrationBuilder.DropColumn(
                name: "lunch_end",
                table: "working_hours");

            migrationBuilder.DropColumn(
                name: "lunch_start",
                table: "working_hours");
        }
    }
}
