import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: cert("yourKey.json"),
  projectId: "yourProjectId",
});

const db = getFirestore();

async function cleanupPosts() {
  console.log("🚀 Starting posts cleanup...");

  const usersSnap = await db.collection("users").get();
  const existingUserIds = new Set(usersSnap.docs.map((d) => d.id));

  console.log(`👤 Users loaded: ${existingUserIds.size}`);

  const postsSnap = await db.collection("posts").get();

  console.log(`📝 Posts loaded: ${postsSnap.size}`);

  const batch = db.batch();
  let count = 0;
  let deleted = 0;

  for (const doc of postsSnap.docs) {
    const data = doc.data();

    const authorId = data.authorId;

    if (!existingUserIds.has(authorId)) {
      batch.delete(doc.ref);
      deleted++;
    }

    count++;

    if (count === 500) {
      await batch.commit();
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log(`✅ Done. Deleted posts: ${deleted}`);
  process.exit(0);
}

cleanupPosts().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
