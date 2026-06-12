import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

function mapFirestoreError(err: any): never {
  switch (err?.code) {
    case 6:
      throw new ConflictException("Document already exists");

    case 5:
      throw new NotFoundException("Document not found");

    default:
      throw new InternalServerErrorException("Unexpected database error");
  }
}

export default mapFirestoreError;
