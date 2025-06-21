import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  private comments: Comment[] = [
    {
      id: 1,
      postId: 1,
      userCommentby: 'Alice',
      content: 'Great post about Roman history!',
    },
    {
      id: 2,
      postId: 1,
      userCommentby: 'Bob',
      content: 'Very informative, thanks!',
    },
    {
      id: 3,
      postId: 2,
      userCommentby: 'Charlie',
      content: 'I love summer recipes 🍉',
    },
    {
      id: 4,
      postId: 3,
      userCommentby: 'Diana',
      content: 'Pets deserve all the love!',
    },
    {
      id: 5,
      postId: 4,
      userCommentby: 'Eve',
      content: 'This is helpful for healthy living!',
    },
    {
      id: 6,
      postId: 5,
      userCommentby: 'Frank',
      content: 'What’s trending this year? 🤔',
    },
    {
      id: 7,
      postId: 6,
      userCommentby: 'Grace',
      content: 'Beginner tips are always welcome!',
    },
    {
      id: 8,
      postId: 7,
      userCommentby: 'Hank',
      content: 'Looking forward to the events!',
    },
    {
      id: 9,
      postId: 8,
      userCommentby: 'Ivy',
      content: 'Ancient Egypt is so mysterious!',
    },
    {
      id: 10,
      postId: 9,
      userCommentby: 'Jack',
      content: 'I want to try those exotic dishes!',
    },
    {
      id: 11,
      postId: 10,
      userCommentby: 'Alice',
      content: 'Helpful tips for pet training!',
    },
  ];

  private idCounter = 1;
  findAll(): Comment[] {
    return this.comments;
  }

  create(createCommentDto: CreateCommentDto, userCommentby: string): Comment {
    const comment: Comment = {
      id: this.idCounter++,
      userCommentby,
      ...createCommentDto,
    };
    this.comments.push(comment);
    return comment;
  }

  findAllByPostId(postId: number): Comment[] {
    return this.comments.filter((comment) => comment.postId === postId);
  }

  findOne(id: number): Comment {
    const comment = this.comments.find((c) => c.id === id);
    if (!comment)
      throw new NotFoundException(`Comment with id ${id} not found`);
    return comment;
  }

  update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    userCommentby: string,
  ): Comment {
    const comment = this.findOne(id);

    if (comment.userCommentby !== userCommentby) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    return comment;
  }

  remove(id: number, userCommentby: string): void {
    const index = this.comments.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    if (this.comments[index].userCommentby !== userCommentby) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    this.comments.splice(index, 1);
  }
}
