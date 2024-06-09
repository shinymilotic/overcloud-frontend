import { Component, EventEmitter, Input, Output, Signal, computed, inject } from "@angular/core";
import { UserService } from "../../core/services/user.service";
import { User } from "../../core/models/auth/user.model";
import { RouterLink } from "@angular/router";
import { map } from "rxjs/operators";
import { Comment } from "../../core/models/blog/comment.model";
import { AsyncPipe, DatePipe } from "@angular/common";

@Component({
  selector: "app-article-comment",
  templateUrl: "./article-comment.component.html",
  styleUrls: ['./article-comment.component.css'],
  imports: [RouterLink, DatePipe, AsyncPipe],
  standalone: true,
})
export class ArticleCommentComponent {
  @Input() comment!: Comment;
  @Output() delete = new EventEmitter<boolean>();

  canModify: Signal<boolean> = computed(() => {
    if (this.userService.userSignal()?.username === this.comment.author.username) {
      return true;
    }

    return false;
  });

  constructor(private readonly userService: UserService) {}
}
