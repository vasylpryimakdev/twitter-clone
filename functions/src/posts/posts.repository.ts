import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Post } from "./types/post.entity";
import {
  FieldValue,
  Firestore,
  Query,
  Transaction,
} from "firebase-admin/firestore";

import { BaseRepository } from "../common/firebase/base.repository";
import { WritePostModel } from "./types/write-post.model";
import { FindPostsDto } from "./dto/find-posts.dto";
import { COLLECTIONS, FIRESTORE } from "../common/firebase/firebase.constants";
import { mapDoc } from "../common/firebase/mappers/firestore.mapper";
import { PostCounterField } from "./posts.fields";

@Injectable()
export class PostsRepository extends BaseRepository<Post, WritePostModel> {
  constructor(
    @Inject(FIRESTORE)
    firestore: Firestore,
  ) {
    super(firestore, COLLECTIONS.POSTS);
  }

  async findPosts(dto: FindPostsDto) {
    const { userId, limit, cursor, search } = dto;

    const realLimit = limit + 1;

    let query: Query = this.collection;

    if (userId && !search) {
      query = query
        .where("authorId", "==", userId)
        .orderBy("createdAt", "desc");
    }

    else if (search) {
      const normalized = search.toLowerCase();

      query = query
        .where("searchField", ">=", normalized)
        .where("searchField", "<=", normalized + "\uf8ff")
        .orderBy("searchField", "asc")
        .orderBy("createdAt", "desc");
    }

    else {
      query = query.orderBy("score", "desc").orderBy("createdAt", "desc");
    }

    if (cursor) {
      const docRef = this.collection.doc(cursor);
      const cursorDoc = await docRef.get();

      if (!cursorDoc.exists) {
        throw new BadRequestException("Invalid cursor");
      }

      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.limit(realLimit).get();

    const hasNextPage = snapshot.docs.length > limit;

    const docs = hasNextPage ? snapshot.docs.slice(0, limit) : snapshot.docs;

    const nextCursor = docs.length > 0 ? docs[docs.length - 1].id : null;

    return {
      docs: docs.map((doc) => mapDoc<Post>(doc)),
      nextCursor,
      hasNextPage,
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
