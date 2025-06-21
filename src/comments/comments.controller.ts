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
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  private getUserIdFromReq(req): string {
    const userCommentby = req.headers['x-user-id'];
    if (!userCommentby)
      throw new BadRequestException('Missing x-user-id header');
    return userCommentby;
  }

  @HttpPost()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Req() req, @Body() createCommentDto: CreateCommentDto) {
    const userCommentby = this.getUserIdFromReq(req);
    return this.commentsService.create(createCommentDto, userCommentby);
  }

  @Get('post/:postId')
  findAllByPostId(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findAllByPostId(postId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userId = this.getUserIdFromReq(req);
    return this.commentsService.update(id, updateCommentDto, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userCommentby = this.getUserIdFromReq(req);
    this.commentsService.remove(id, userCommentby);
  }
}
