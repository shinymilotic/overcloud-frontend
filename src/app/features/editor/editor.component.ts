import {
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  Renderer2,
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
import { LiveAnnouncer } from "@angular/cdk/a11y";
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
  body: FormControl<string>;
}

@Component({
  selector: "app-editor-page",
  templateUrl: "./editor.component.html",
  imports: [
    ListErrorsComponent,
    ReactiveFormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    FormsModule,
    LexicalEditorBinding,
  ],
  styleUrls: ["./editor.component.css"],
  standalone: true,
})
export class EditorComponent implements OnInit, OnDestroy {
  @HostBinding("class") classes = "app-editor-page";
  articleForm: FormGroup<ArticleForm>;
  tagField: FormControl<string>;
  errors!: Errors[];
  isSubmitting = false;
  destroy$ = new Subject<void>();
  filteredTags: Observable<string[]>;
  inTags: string[] = [];
  allTags!: string[];
  tagsLoaded = false;
  @ViewChild("tagInput") tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild("tagInputTextElement")
  tagInputTextElement!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);
  isUpdate: boolean = false;
  editor!: LexicalEditor;
  isInputTag: boolean = true;
  selectedTagIndex: number;
  activeElement: Element | null = null;

  constructor(
    private readonly articleService: ArticlesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private renderer: Renderer2
  ) {
    this.articleForm = new FormGroup<ArticleForm>({
      title: new FormControl("", { nonNullable: true }),
      description: new FormControl("", { nonNullable: true }),
      slug: new FormControl("", { nonNullable: true }),
      body: new FormControl("", { nonNullable: true }),
    });
    this.tagField = new FormControl<string>("", { nonNullable: true });
    this.filteredTags = inject(TagsService)
      .getAll()
      .pipe(tap(() => (this.tagsLoaded = true)));
    this.selectedTagIndex = -1;
  }

  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || "").trim();

  //   if (value) {
  //     this.inTags.push(value);
  //   }

  //   event.chipInput!.clear();

  //   this.tagField.setValue("");
  // }

  remove(tag: string): void {
    const index = this.inTags.indexOf(tag);

    if (index >= 0) {
      this.inTags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
    }
  }

  // selected(event: MatAutocompleteSelectedEvent): void {
  //   this.inTags.push(event.option.viewValue);
  //   this.tagInput.nativeElement.value = "";
  //   this.tagField.setValue("");
  // }

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
        .subscribe(([article, user]) => {
          if (user.username === article.author.username) {
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
    this.articleForm.controls.body.setValue(htmlString);
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
        tagList: this.inTags,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article) => {
          this.router.navigate(["/articles/", article.slug]);
        },
        error: (errors) => {
          this.errors = errors.errors;
          this.isSubmitting = false;
        },
      });
  }

  focusInputTag() {
    this.isInputTag = false;
  }

  loseFocusInputTag() {
    this.isInputTag = true;
  }

  changeInputTag() {}

  selectTag($event: KeyboardEvent) {
    if ($event.key === "ArrowDown") {
      this.handleArrowDown();
    } else if ($event.key === "ArrowUp") {
      this.handleArrowUp();
    } else if ($event.key === "Enter") {
      this.handleEnter();
    }
  }

  handleEnter() {
    let element: Element | null = this.activeElement;

    if (element != null && element.innerHTML != null) {
      let tag: string = element.innerHTML;
      if (tag != null && tag.trim() !== "" && this.inTags.indexOf(tag) < 0) {
        this.inTags.push(tag);
      }
    }
  }

  handleArrowDown() {
    if (this.activeElement == null) {
      this.activeElement = this.tagInput.nativeElement.firstElementChild;
      this.renderer.addClass(this.activeElement, "selectedTag");
    } else if (
      this.activeElement == this.tagInput.nativeElement.lastElementChild
    ) {
      this.renderer.removeClass(this.activeElement, "selectedTag");
      this.activeElement = null;
    } else {
      this.renderer.removeClass(this.activeElement, "selectedTag");
      this.activeElement = this.activeElement.nextElementSibling;
      this.renderer.addClass(this.activeElement, "selectedTag");
    }
  }

  handleArrowUp() {
    if (this.activeElement == null) {
      this.activeElement = this.tagInput.nativeElement.lastElementChild;
      this.renderer.addClass(this.activeElement, "selectedTag");
    } else if (
      this.activeElement == this.tagInput.nativeElement.firstElementChild
    ) {
      this.renderer.removeClass(this.activeElement, "selectedTag");
      this.activeElement = null;
    } else {
      this.renderer.removeClass(this.activeElement, "selectedTag");
      this.activeElement = this.activeElement.previousElementSibling;
      this.renderer.addClass(this.activeElement, "selectedTag");
    }
  }

  mouseEnterTag($event: any) {
    let target: Element = $event.target;
    if (this.activeElement != null) {
      this.renderer.removeClass(this.activeElement, "selectedTag");
    }
    this.activeElement = target;
    this.renderer.addClass(this.activeElement, "selectedTag");
  }

  clickTag() {
    let element: Element | null = this.activeElement;
    console.log(element);
    if (element != null && element.innerHTML != null) {
      let tag: string = element.innerHTML;
      if (tag != null && tag.trim() !== "" && this.inTags.indexOf(tag) < 0) {
        this.inTags.push(tag);
      }
    }
  }
}
