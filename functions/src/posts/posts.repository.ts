import { Inject, Injectable } from "@nestjs/common";
import { Post } from "./types/post.entity";
import {
  FieldValue,
  Firestore,
  Query,
  Transaction,
} from "firebase-admin/firestore";

import { BaseRepository } from "../common/firestore/base.repository";
import { FIRESTORE } from "../common/firestore/firestore.provider";
import { WritePostModel } from "./types/write-post.model";
import { PostCounterField } from "./types/post-counter-field";
import { mapDoc } from "../common/firestore/firestore.mapper";
import { FindPostsDto } from "./dto/find-posts.dto";

@Injectable()
export class PostsRepository extends BaseRepository<Post, WritePostModel> {
  constructor(
    @Inject(FIRESTORE)
    firestore: Firestore,
  ) {
    super(firestore, "posts");
  }

  async findPosts(dto: FindPostsDto) {
    const { userId, limit, cursor, search } = dto;

    let query: Query = this.firestore.collection("posts");

    if (userId) {
      query = query.where("authorId", "==", userId);
    }

    if (search) {
      const normalized = search.toLowerCase();

      query = query
        .where("searchField", ">=", normalized)
        .where("searchField", "<=", normalized + "\uf8ff");
    }

    query = query.orderBy("createdAt", "desc").limit(limit);

    if (cursor) {
      const cursorDoc = await this.firestore
        .collection("posts")
        .doc(cursor)
        .get();

      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.get();

    const docs = snapshot.docs.map((doc) => mapDoc<Post>(doc));

    const lastDoc =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

    return {
      docs,
      lastDoc,
    };
  }

  async adjustCounter(
    id: string,
    field: PostCounterField,
    delta: number,
    tx?: Transaction,
  ): Promise<void> {
    const ref = this.getRef(id);

    const updateData = {
      [field]: FieldValue.increment(delta),
    };

    if (tx) {
      tx.update(ref, updateData);
      return;
    }

    await ref.update(updateData);
  }
}
