import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class PostsService {
  constructor(private readonly commentsService: CommentsService) {}

  private posts: Post[] = [
    {
      id: 1,
      title: 'The history of ancient Rome',
      content: 'Exploring the rise and fall of the Roman Empire.',
      userPostby: 'Anny',
      community_type: 'History',
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'Best recipes for summer',
      content: 'Delicious and refreshing food ideas to beat the heat.',
      userPostby: 'Anny',
      community_type: 'Food',
      createdAt: new Date(),
    },
    {
      id: 3,
      title: 'Caring for your pets',
      content: 'Tips on keeping your pets healthy and happy.',
      userPostby: 'Anny',
      community_type: 'Pets',
      createdAt: new Date(),
    },
    {
      id: 4,
      title: 'Healthy living basics',
      content: 'Simple habits to improve your overall health.',
      userPostby: 'Anny',
      community_type: 'Health',
      createdAt: new Date(),
    },
    {
      id: 5,
      title: 'Latest fashion trends 2025',
      content: 'What to wear this year to stay in style.',
      userPostby: 'Anny',
      community_type: 'Fashion',
      createdAt: new Date(),
    },
    {
      id: 6,
      title: 'Exercise routines for beginners',
      content: 'Start your fitness journey with these exercises.',
      userPostby: 'Anny',
      community_type: 'Exercise',
      createdAt: new Date(),
    },
    {
      id: 7,
      title: 'Community events this month',
      content: "What's happening in the neighborhood.",
      userPostby: 'Anny',
      community_type: 'Others',
      createdAt: new Date(),
    },
    {
      id: 8,
      title: 'Ancient Egypt mysteries',
      content: 'Uncover the secrets of the Pharaohs.',
      userPostby: 'Anny',
      community_type: 'History',
      createdAt: new Date(),
    },
    {
      id: 9,
      title: 'Exotic food experiences',
      content: "Travel and taste the world's unique dishes.",
      userPostby: 'Anny',
      community_type: 'Food',
      createdAt: new Date(),
    },
    {
      id: 10,
      title: 'Pet training basics',
      content: 'How to train your pet with positive reinforcement.',
      userPostby: 'Anny',
      community_type: 'Pets',
      createdAt: new Date(),
    },
  ];
  private idCounter = 1;

  create(createPostDto: CreatePostDto, userPostby: string): Post {
    const post: Post = {
      id: this.idCounter++,
      ...createPostDto,
      userPostby,
      createdAt: new Date(),
    };
    this.posts.push(post);
    return post;
  }

  findAll(): Post[] {
    const allComments = this.commentsService.findAll();
    return this.posts.map((post) => ({
      ...post,
      comments: allComments.filter((c) => c.postId === post.id),
    }));
  }

  findOne(id: number): any {
    const post = this.posts.find((p) => p.id === id);
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    const comments = this.commentsService.findAllByPostId(id);
    return { ...post, comments };
  }

  update(id: number, updatePostDto: UpdatePostDto, userPostby: string): Post {
    const post = this.findOne(id);

    if (post.userPostby !== userPostby) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, updatePostDto);
    return post;
  }

  remove(id: number, userPostby: string): void {
    const index = this.posts.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (this.posts[index].userPostby !== userPostby) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    this.posts.splice(index, 1);
  }

  findAllByUserId(userPostby: string): Post[] {
    return this.posts.filter((post) => post.userPostby === userPostby);
  }
}
