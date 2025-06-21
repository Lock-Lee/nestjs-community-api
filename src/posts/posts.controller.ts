import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Req,
  UsePipes,
  ValidationPipe,
  HttpCode,
  BadRequestException,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  private getUserIdFromReq(req): string {
    const userPostby = req.headers['x-user-id'];
    if (!userPostby) throw new Error('Missing x-user-id header');
    return userPostby;
  }

  @Post()
  create(@Req() req, @Body() createPostDto: CreatePostDto) {
    const userPostby = req.headers['x-user-id'];
    if (!userPostby) throw new BadRequestException('Missing userId');
    return this.postsService.create(createPostDto, userPostby);
  }
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userPostby = this.getUserIdFromReq(req);
    return this.postsService.update(id, updatePostDto, userPostby);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userPostby = this.getUserIdFromReq(req);
    this.postsService.remove(id, userPostby);
  }

  @Get('user/:userId')
  findAllByUserId(@Param('userId') userPostby: string) {
    const userId = userPostby;
    return this.postsService.findAllByUserId(userId);
  }
}
