import { db } from "./index";

async function main() {
  console.log("Startuji seedování databáze...");

  // Vyčistíme stávající data (volitelné)
  await db.user.deleteMany();

  const users = [
    { name: "Jindřich", email: "jindrich@example.com" },
    { name: "Jan", email: "jan@example.com" },
    { name: "Gemini", email: "gemini@ai.local" },
  ];

  for (const u of users) {
    const user = await db.user.create({
      data: u,
    });
    console.log(`Vytvořen uživatel: ${user.name} (${user.id})`);
  }

  console.log("Seedování dokončeno!");
}
main()
  .catch((e) => {
    console.error("Chyba při seedování:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
  