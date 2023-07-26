import {
  AfterViewInit,
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
import EditorJS, { OutputData } from "@editorjs/editorjs";
// @ts-ignore
import Header from "@editorjs/header";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import LinkTool from "@editorjs/link";
// @ts-ignore
import RawTool from "@editorjs/raw";
// @ts-ignore
import SimpleImage from "@editorjs/simple-image";
// @ts-ignore
import Checklist from "@editorjs/checklist";
// @ts-ignore
import Embed from "@editorjs/embed";
// @ts-ignore
import Quote from "@editorjs/quote";
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
import { createEditor } from "lexical";
import { ReactBidirectionalRendererComponent } from "src/app/react-bidirectional-renderer.component";

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
    ReactBidirectionalRendererComponent,
  ],
  styleUrls: ["./editor.component.css"],
  standalone: true,
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {
  articleForm: UntypedFormGroup = new FormGroup<ArticleForm>({
    title: new FormControl("", { nonNullable: true }),
    description: new FormControl("", { nonNullable: true }),
    slug: new FormControl("", { nonNullable: true }),
  });
  tagField = new FormControl<string>("", { nonNullable: true });

  errors!: Errors[];
  isSubmitting = false;
  destroy$ = new Subject<void>();
  @ViewChild("editorjs", { read: ElementRef })
  editorElement!: ElementRef;
  private editor!: EditorJS;

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

  constructor(
    private readonly articleService: ArticlesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  ngAfterViewInit() {
    console.log("AfterViewInit");
    this.initializeEditor();
  }

  private initializeEditor() {
    this.editor = new EditorJS({
      onReady: () => {
        if (this.body.value != "") {
          this.editor.render(this.convertStringToJson(this.body.value));
        }
      },
      minHeight: 50,
      holder: this.editorElement.nativeElement,
      placeholder: "Nội dung...",
      tools: {
        header: Header,
        list: List,
        image: SimpleImage,
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
            },
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+O",
          config: {
            quotePlaceholder: "Viết trích dẫn",
            captionPlaceholder: "Tác giả của trích dẫn",
          },
        },
      },
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our fruit
    if (value) {
      this.inTags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagField.setValue("");
  }

  remove(fruit: string): void {
    const index = this.inTags.indexOf(fruit);

    if (index >= 0) {
      this.inTags.splice(index, 1);
      this.announcer.announce(`Removed ${fruit}`);
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
    console.log("OnInit");

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

  convertStringToJson(body: string): OutputData {
    return JSON.parse(body);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTag() {
    // retrieve tag control
    const tag = this.tagField.value;
    // only add tag if it does not exist yet
    if (tag != null && tag.trim() !== "" && this.inTags.indexOf(tag) < 0) {
      this.inTags.push(tag);
    }
    // clear the input
    this.tagField.reset("");
  }

  removeTag(tagName: string): void {
    this.inTags = this.inTags.filter((tag) => tag !== tagName);
  }

  submitForm(): void {
    this.isSubmitting = true;
    // update any single tag
    this.addTag();

    this.editor
      .save()
      .then((outputData) => {
        const body = JSON.stringify(outputData);
        if (this.isUpdate === true) {
          // put the changes
          // post the changes
          this.articleService
            .update({
              ...this.articleForm.value,
              body: body,
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
        } else {
          // post the changes
          this.articleService
            .create({
              ...this.articleForm.value,
              body: body,
              tagList: this.inTags,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (article) => {
                this.router.navigate(["/articles/", article.slug]);
              },
              error: ({ errors }) => {
                this.errors = errors;
                this.isSubmitting = false;
              },
            });
        }
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  }

  createArticle() {}

  updateArticle() {}
}
