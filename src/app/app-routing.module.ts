import { inject, NgModule } from "@angular/core";
import {
  Routes,
  RouterModule,
  PreloadAllModules,
  UrlSegment,
} from "@angular/router";
import { UserService } from "./core/services/user.service";
import { map } from "rxjs/operators";
import { ProfileComponent } from "./features/profile/show-profile/profile.component";
import { TestListComponent } from "./features/test/test-list/test-list.component";
import { PracticeResultComponent } from "./features/profile/practice-result/practice-result.component";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./features/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "tests",
    loadComponent: () =>
      import("./features/test/test-list/test-list.component").then(
        (m) => m.TestListComponent
      ),
  },
  {
    path: "practice/:slug",
    loadComponent: () =>
      import("./features/test/practice-test/test.component").then(
        (m) => m.TestComponent
      ),
  },
  {
    path: "createTest",
    loadComponent: () =>
      import("./features/test/create-test/create-test.component").then(
        (m) => m.CreateTestComponent
      ),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./features/user/login/login.component").then(
        (m) => m.LoginComponent
      ),
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: "register",
    loadComponent: () =>
      import("./features/user/register/register.component").then(
        (m) => m.RegisterComponent
      ),
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: "settings",
    loadComponent: () =>
      import("./features/settings/settings.component").then(
        (m) => m.SettingsComponent
      ),
    canActivate: [() => inject(UserService).isAuthenticated],
  },
  {
    // path: ":username",
    matcher: (url) => {
      const username: string = url[0].path;
      if (url.length === 1 && username.match(/^@[\w]+$/gm)) {
        return {
          consumed: url,
          posParams: { username: new UrlSegment(username.slice(1), {}) },
        };
      } else if (
        url.length === 2 &&
        username.match(/^@[\w]+$/gm) &&
        (url[1].path.match("favorites") || url[1].path.match("practices"))
      ) {
        return {
          consumed: url.slice(0, 1),
          posParams: { username: new UrlSegment(username.slice(1), {}) },
        };
      }
      return null;
    },
    component: ProfileComponent,
    children: [
      {
        path: "",
        loadComponent: () =>
          import(
            "./features/profile/profile-articles/profile-articles.component"
          ).then((m) => m.ProfileArticlesComponent),
      },
      {
        path: "favorites",
        loadComponent: () =>
          import(
            "./features/profile/profile-favorites/profile-favorites.component"
          ).then((m) => m.ProfileFavoritesComponent),
      },
      {
        path: "practices",
        loadComponent: () =>
          import(
            "./features/profile/user-practice/user-practice.component"
          ).then((m) => m.UserPracticeComponent),
        // children: [
        //   {
        //     path: ":id",
        //     // matcher: (url) => {
        //     //   console.log(url);
        //     //   if (url.length === 1 && url[0].path.match("practices")) {
        //     //     return {
        //     //       consumed: url,
        //     //       posParams: { username: new UrlSegment(url[0].path.slice(1), {}) },
        //     //     };
        //     //   }
        //     //   return null;
        //     // },
        //     loadComponent: () =>
        //       import(
        //         "./features/profile/practice-result/practice-result.component"
        //       ).then((m) => m.PracticeResultComponent)
        //   }
        // ]
      },
    ],
  },
  {
    matcher: (url) => {
      const username: string = url[0].path;
      const id: string = url[2].path;
      if (
        url.length === 3 &&
        username.match(/^@[\w]+$/gm) &&
        url[1].path.match("practices")
      ) {
        return {
          consumed: url,
          posParams: {
            username: new UrlSegment(username.slice(1), {}),
            id: new UrlSegment(id, {}),
          },
        };
      }
      return null;
    },
    loadComponent: () =>
      import(
        "./features/profile/practice-result/practice-result.component"
      ).then((m) => m.PracticeResultComponent),
  },
  {
    path: "editor",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./features/editor/editor.component").then(
            (m) => m.EditorComponent
          ),
        canActivate: [() => inject(UserService).isAuthenticated],
      },
      {
        path: ":slug",
        loadComponent: () =>
          import("./features/editor/editor.component").then(
            (m) => m.EditorComponent
          ),
        canActivate: [() => inject(UserService).isAuthenticated],
      },
    ],
  },
  {
    path: "articles/:slug",
    loadComponent: () =>
      import("./features/article/article.component").then(
        (m) => m.ArticleComponent
      ),
  },
  // {
  //   matcher: (url) => {
  //     if (
  //       url.length === 2 &&
  //       url[0].path.match(/^@[\w]+$/gm) &&
  //       url[1].path === "practice"
  //     ) {
  //       return {
  //         consumed: url,
  //         posParams: { username: new UrlSegment(url[0].path.slice(1), {}) },
  //       };
  //     }
  //     return null;
  //   },
  //   component: PracticeResultComponent,
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
