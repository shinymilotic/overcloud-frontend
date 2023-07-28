import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import {
  UntypedFormGroup,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ListErrorsComponent } from "../../shared/list-errors.component";
import { NgForOf, NgFor, AsyncPipe } from "@angular/common";
import { ArticlesService } from "../../core/services/articles.service";
import { combineLatest, Observable, Subject, throwError } from "rxjs";
import { catchError, map, startWith, takeUntil, tap } from "rxjs/operators";
import { UserService } from "../../core/services/user.service";
import { Errors } from "../../core/models/errors.model";
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from "@angular/material/autocomplete";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { TagsService } from "src/app/core/services/tags.service";
import { LexicalEditorBinding } from "src/app/lexical-editor.component";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  EditorState,
  LexicalEditor,
} from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";

interface ArticleForm {
  title: FormControl<string>;
  description: FormControl<string>;
  slug: FormControl<string>;
  // body: FormControl<string>;
}

@Component({
  selector: "app-editor-page",
  templateUrl: "./editor.component.html",
  imports: [
    ListErrorsComponent,
    ReactiveFormsModule,
    NgForOf,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    LexicalEditorBinding,
  ],
  styleUrls: ["./editor.component.css"],
  standalone: true,
})
export class EditorComponent implements OnInit, OnDestroy {
  articleForm: UntypedFormGroup = new FormGroup<ArticleForm>({
    title: new FormControl("", { nonNullable: true }),
    description: new FormControl("", { nonNullable: true }),
    slug: new FormControl("", { nonNullable: true }),
  });
  tagField = new FormControl<string>("", { nonNullable: true });
  errors!: Errors[];
  isSubmitting = false;
  destroy$ = new Subject<void>();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<string[]> = inject(TagsService)
    .getAll()
    .pipe(tap(() => (this.tagsLoaded = true)));
  inTags: string[] = [];
  allTags!: string[];
  tagsLoaded = false;
  @ViewChild("tagInput") tagInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);
  body = new FormControl("", { nonNullable: true });
  isUpdate: boolean = false;
  editor!: LexicalEditor;

  constructor(
    private readonly articleService: ArticlesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    if (value) {
      this.inTags.push(value);
    }

    event.chipInput!.clear();

    this.tagField.setValue("");
  }

  remove(tag: string): void {
    const index = this.inTags.indexOf(tag);

    if (index >= 0) {
      this.inTags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.inTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = "";
    this.tagField.setValue("");
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  ngOnInit() {
    const slug = this.route.snapshot.params["slug"];
    if (slug != undefined) {
      combineLatest([
        this.articleService.get(slug),
        this.userService.getCurrentUser(),
      ])
        .pipe(
          catchError((err) => {
            void this.router.navigate(["/editor"]);
            return throwError(err);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(([article, { user }]) => {
          if (user.username === article.author.username) {
            this.body.setValue(article.body);
            this.inTags = article.tagList;
            this.articleForm.patchValue(article);
            this.isUpdate = true;
          } else {
            void this.router.navigate(["/"]);
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTag() {
    const tag = this.tagField.value;

    if (tag != null && tag.trim() !== "" && this.inTags.indexOf(tag) < 0) {
      this.inTags.push(tag);
    }

    this.tagField.reset("");
  }

  removeTag(tagName: string): void {
    this.inTags = this.inTags.filter((tag) => tag !== tagName);
  }

  submitForm(): void {
    this.isSubmitting = true;
    this.addTag();
    let htmlString = "";
    this.editor.update(() => {
      htmlString = $generateHtmlFromNodes(this.editor, null);
    });
    this.body.setValue(htmlString);
    if (this.isUpdate === true) {
      this.updateArticle();
    } else {
      this.createArticle();
    }
  }

  updateBodyChange(editor: LexicalEditor) {
    this.editor = editor;
  }

  updateArticle() {
    this.articleService
      .update({
        ...this.articleForm.value,
        body: this.body.value,
        tagList: this.inTags,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article) => {
          this.router.navigate(["/articles/", article.slug]);
        },
        error: (err) => {
          this.errors = err;
          this.isSubmitting = false;
        },
      });
  }

  createArticle() {
    this.articleService
      .create({
        ...this.articleForm.value,
        body: this.body.value,
        tagList: this.inTags,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article) => {
          this.router.navigate(["/articles/", article.slug]);
        },
        error: (errors) => {
          this.errors = errors;
          this.isSubmitting = false;
        },
      });
  }
}
